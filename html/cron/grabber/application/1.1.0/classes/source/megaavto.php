<?php defined('SYSPATH') or die('No direct script access.');

class Source_Megaavto extends Source implements Kohana_Source {
   protected $_parsed_items = array();
   protected $_img_present  = array();
   
   public function execute()
   {
      $this->_img_present  = array();
	  
      $search = $this->_config['search'];
           
      foreach ($this->_get_active_items($search['items']) AS $search_id)
      {          
         $condition = Kohana::config('search.'.$search_id);

         $car_id = $condition['parent'];

         $car = Jelly::select('admin_cars')
         ->where(':primary_key', '=', $car_id)
         ->execute()
         ->current();

         $fields = $condition['fields'] + array(
            'fromYear' => intval($car->year_from) == 0 ? 'ALL' : intval($car->year_from),
            'toYear' => intval($car->year_to) == 0 ? 'ALL' : intval($car->year_to),
         );
		 $fields        = $fields + $search['fields'];
		 $fields_second = $search['fieldsSecond'];
		 $fields_offset = $search['fieldsOffset'];		 
		 
         $second_cnt = -1;
         $offset_cnt = 0;
		 $first_pass = true;

         while (true) {
             $fields_url = http_build_query(array_merge(Arr::get($search, 'fields'), $fields)).'&offset='.($offset_cnt*$search['offset']).'&limit='.$search['offset'];

             $options = $this->_remote_options;
             $options[CURLOPT_POST] = TRUE;
             $options[CURLOPT_REFERER] = $options[CURLOPT_REFERER].($first_pass ? '' : '?mode=search');
			 
			 if ($first_pass) {
			     $params_list = $this->_build_params_list($fields);
				 $first_pass = false;
			 } else {
			     $params_list = $this->_build_params_list($fields).'&'. 
				                $this->_build_params_list($fields_second).'&'. 
								$this->_build_params_list($fields_offset, array('searchResultsOffset'), $offset_cnt*$search['offset']);
			 }
			
			 $options[CURLOPT_POSTFIELDS] = $params_list;			 
			 
             $request_url     = $search['url'];
             $request_options = $options;
			 
             $response_basic = Remote::factory($request_url, $request_options)->execute();

             if ($response_basic === FALSE)
             {
                Kohana::$log->add(Log::ERROR, '500 Internal Server Error');
                return;
             }

             $total = 0;

             if (! (bool) preg_match('/По вашему запросу ничего не найдено./iu', $response_basic))
             {
                if ((bool) preg_match('#<b>Всего по вашему запросу найдено:</b>&nbsp;(\d+)&nbsp;авто<br />#iu', $response_basic, $matches)) {
                    $total = (int) Arr::get($matches, 1);                    
                }
             }
			 
             if ($total > 0 && $second_cnt == -1) {
                 $second_cnt = intval($total/$search['offset']);
                 if ($second_cnt*$search['offset'] < $total) {
                     $second_cnt++;
                 }
             }

             $passed = 0;
             $filtered_by_colors = 0;
             $filtered_by_options = 0;
             $added = 0;
             $cached = 0;

             if ($total > 0)
             {
                $filters = $condition['filters'] + array(
                   'mileage' => $car->mileage
                );

                $items = $this->_parse($response_basic, $filters);

                $passed += sizeof($items);

                if (! empty($items))
                {
                   foreach ($items AS $item)
                   {
                        $cached_item = Jelly::select('cars_cache')->where('url','=',$item['url'])->execute()->current();

                        if ($cached_item->url == null) {
                           $item['source_id'] = $this->_id;
                           $item['target_id'] = $car_id;
                           $item['search_id'] = $search_id;
                           $item['options']   = $this->_get_options($this, $item['url']);
                           $item['picture']   = $this->_picture_exists($item['url'], $item['vincode']);
                        } else {
                           $item = Jelly::factory('cars_cache')->get_item_from_cache($cached_item);
                        }
                        if (!$this->_is_exist_vincode($item['vincode'],$search_id)){
                              Jelly::factory('cars')
                              ->set($item)
                              ->save();

                               if ($cached_item->url==null)
                               {
                                   Jelly::factory('cars_cache')
                                       ->set($item)
                                       ->save();
                                   $cached += $this->_cache($item['vincode'], $condition['mark'], $car_id, $condition['cache']);
                               }
                        }
                   }

                   $colors = $this->_get_colors($car_id);

                   if (! empty($colors))
                   {
                      $filtered_by_colors = Jelly::factory('cars')
                         ->color_filter($search_id, $colors);
                   }

                   $filtered_by_options = $this->_cache_options($car_id, $this->_id);
                   
                   $filtered_by_options = 0;
                   $filtered_by_colors  = 0;

                   unset($items);
                }

                $added = $passed - ($filtered_by_colors + $filtered_by_options);
             }
             
             $second_cnt--;
             $offset_cnt++;
             if ($second_cnt <= 0) break;
         }

         Jelly::factory('statuses')
            ->set(array(
               'target_id' => $car_id,
               'source_id' => $this->_id,
               'items_added' => $added,
            ))
            ->save();

         $this->_log($car->name, array(
            'found: '.$total,
            'pass primary filters: '.$passed,
            'did not pass the filter by colors: '.$filtered_by_colors,
            'did not pass the filter by options: '.$filtered_by_options,
            'added: '.$added,
            'new vincodes: '.$cached
         ));
      }
   }

   public function get_ident($url)
   {
	  parse_str(Arr::get(parse_url($url), 'query'), $qs);
	  return Arr::get($qs, 'car');
   }

   protected function _build_params_list($fields, $fields_to_replace = false, $replace_value = false) {	  
	  if ($fields_to_replace !== false && $replace_value !== false) {
	      foreach ($fields_to_replace as $indx => $val) {
		      $fields[$val] = $replace_value;
		  }
	  }
	  
	  $result = array();
	  
	  foreach ($fields as $field_name => $field_val) {
	      if (is_array($field_val)) {
		      foreach ($field_val as $indx => $val) {
			      $result[] = $field_name.'='.urlencode($val);
			  }
		  } else {
		      $result[] = $field_name.'='.urlencode($field_val);
		  }
	  }

      return implode('&', $result);
   }

   public function callBack($matches) {	   
       static $count = false;
	   	   
	   if ($count === false) {
	       $count = 0;
	   } else {
	       $count++;
	   }

	   $matches[1] = $matches[4];
	   
	   $image_present = 1;
	   
	   preg_match('#<td><a href="([^"]*)"[^>]*>([^<]*)</a><br /><strong>VIN:</strong> ([0-9A-Z]{17})<br/>#isU', $matches[1], $found);
	   if (isset($found[1]) && isset($found[2]) && isset($found[3])) {
	       $url      = $this->_config['domain'].$found[1];
	       $car_name = $found[2];
		   $vin_code = trim($found[3]);
	   } else {
	       $url      = '';
	       $car_name = '';
		   $vin_code = '';
	   }
	   
	   preg_match("#<strong>Пробег:&nbsp;</strong>([^<]*)#isu", $matches[1], $found);
	   if (isset($found[1])) {
		   $mileage = preg_replace('/[,.]/', '', trim($found[1]));
		   if (mb_substr($mileage, -2) != 'mi') {
			   $mileage = intval(round(floatval($mileage) * 0.62136994937697));
		   } else {
			   $mileage = intval($mileage);
		   }
	   } else {
	       $mileage = 0;
	   }
	   
	   preg_match("#<strong>Цвет:&nbsp;</strong>([^|]*)[|]([^<]*)<br />#isu", $matches[1], $found);
	   if (isset($found[1]) && isset($found[2])) {
		   $color_exterior = trim($found[1]) == 'Не задано' ? '' : trim($found[1]);
		   $color_interior = trim($found[2]) == 'Не задано' ? '' : trim($found[2]);
	   } else {
		   $color_exterior = '';
		   $color_interior = '';
	   }
	   
	   preg_match("#<b>Прогнозируемая цена:</b><br />([^<]*)</td>#isu", $matches[1], $found);
	   if (isset($found[1])) {
	       $price = intval(preg_replace('/[$,]/', '', trim($found[1])));
	   } else {
	       $price = 0;
	   }

	   preg_match("#([0-9]{2}/[0-9]{2}/[0-9]{4} - [0-9]{2}:[0-9]{2} (AM|PM))#isu", $matches[1], $found);
	   if (isset($found[1])) {
		   $found[1] = preg_replace('/ - /u', ' ', $found[1]);
		   $auction_date = date('Y-m-d H:i:s', strtotime($found[1]));;
	   } else {
	       $auction_date = '';
	   }

	   if ($car_name != '' && $vin_code != '' && $url != '') {
	       $this->_img_present[md5($url.$vin_code)] = $image_present;
		   
		   $this->_parsed_items[] = array(
			   'date_auction' => $auction_date,
			   'name'         => $car_name,
			   'vincode'      => $vin_code,
			   'mileage'      => $mileage,
			   'exterior'     => $color_exterior,
			   'interior'     => $color_interior,
			   'price'        => $price,
			   'url'          => $url,
			   'img_prsnt'    => $image_present,
		   );
	   }
   }
   
   protected function _parse(&$content, array $filters = NULL)
   {     
      $output = array();
      
      try
      {
	     $this->_parsed_items = array();
		 
	     $pattern  = '$<tr style="((background-color:#fff;)|(background-color:transparent;))">(.*)</tr>$isU';
		 preg_replace_callback($pattern, array($this, 'callBack'), $content);

         foreach ($this->_parsed_items AS $indx => $score)
         {
            $matches = array(
               'vincode' => $score['vincode'],
               'mileage' => $score['mileage'],
               'color'   => $score['exterior'],
               'series'  => '',
            );

            if (Filter::factory($filters, $matches)->validate()) {
               $output[] = $score;
            }
         }
		 
         return $output;
      }
      catch (Kohana_Exception $e)
      {
         throw $e;
      }
   }

   protected function _clearup($str)
   {
      return trim($str);
   }

   protected function _picture_exists($url, $vincode)
   {
      $img_index = md5($url.$vincode);
      if (!isset($this->_img_present[$img_index])) return false;
	  
	  $picture_exists = $this->_img_present[$img_index] == 1 ? true : false;
	  
	  if (!$picture_exists) return false;
	  
	  $content = Remote::factory($url, $this->_remote_options)->execute();
	  
      if ($content === FALSE)
      {
         return false;
      }
	  
	  //$picture_exists = preg_match('#<img src="http://images.dev6.jl.by/jlabProxyList/getImg.php?img=.*"[^>]+>#', $content);
	  $picture_exists = true;

      if ($picture_exists)
      {
         Filecache::factory()
            ->set_url($url)
            ->set_path(strtoupper($vincode).'-MEGAAVTO')
            ->import($content, true, true);
      }
      
      return true;
   }
}
