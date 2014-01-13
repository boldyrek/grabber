<?php defined('SYSPATH') or die('No direct script access.');

class Source_Adesa extends Source implements Kohana_Source {

   public function execute()
   {
      
      if (! $this->_login())
      {
         Kohana::$log->add(Log::ERROR, 'Unauthorized request');
         return;
      }
            
      $search = $this->_config['search'];
      $second_search = $this->_config['second_search'];
        
      foreach ($this->_get_active_items($search['items']) AS $search_id)
      {		 
         $condition = Kohana::config('search.'.$search_id);

         $car_id = $condition['parent'];

         $models = array();

         foreach (Arr::get($condition['fields'], 'ml') AS $model)
         {
            $models[] = 'ml='.urlencode($model);
         }

         $models = implode('&', $models);

         unset($condition['fields']['ml']);

         $car = Jelly::select('admin_cars')
         ->where(':primary_key', '=', $car_id)
         ->execute()
         ->current();

         $fields = $condition['fields'] + array(
            'y1' => $car->year_from,
            'y2' => $car->year_to,
            'km' => $car->mileage
         );

         $fields = http_build_query(Arr::get($search, 'fields'))
         .'&'.http_build_query($fields)
         .'&'.$models;

         $options = $this->_remote_options + array(
            CURLOPT_POST => TRUE,
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_REFERER => $search['url'],
         );
         		 
         Remote::factory($this->_config['runlist_url'], $this->_remote_options)->execute();

         $request_url = $search['url'];
         $request_options = $options;
         
         $second_cnt = -1;
         $offset_cnt = 0;
         		 
         while (true) {
             $response = Remote::factory($request_url, $request_options)->execute();
			 
             if (strpos($response, 'Error 500') !== FALSE)
             {
                Kohana::$log->add(Log::ERROR, '500 Internal Server Error');
                return;
             }

             $total = 0;

             if (! (bool) preg_match('/No Records Found/i', $response))
             {
				if ((bool) preg_match('#<b><font[^>]+>(\d+)</font>&nbsp;Total Vehicles</b>#i', $response, $matches))
                   $total = (int) Arr::get($matches, 1);
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

                $items = $this->_parse($response, $filters);
				               
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

                   unset($items);
                }

                $added = $passed - ($filtered_by_colors + $filtered_by_options);
             }
             
             $second_cnt--;
             $offset_cnt++;
             if ($second_cnt <= 0) break;

             $fields = http_build_query(Arr::get($second_search, 'fields')).'&offset='.($offset_cnt*$search['offset']);

             $request_options = $this->_remote_options + array(
                CURLOPT_POST => TRUE,
                CURLOPT_POSTFIELDS => $fields,
                CURLOPT_REFERER => $search['url'],
             );

             $request_url = $second_search['url'];
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
      return Arr::get($qs, (strpos($url, $this->_config['domain']) === FALSE) ? 'VIN' : 'aiid');
   }

   protected function _parse($content, array $filters = NULL)
   {
	  $output = array();

	  $pos = strpos($content, '<table border="0" cellpadding="2" cellspacing="0" bgcolor="#E4E4E4" align="center">');
	  if ($pos !== false) {
	      $html_text = substr($content, $pos);
	  } else {
	      $html_text = '<p>Empty</p>';
	  }
	  
	  $pos = strpos($html_text, '<input type="hidden" id="srollPos"');
	  if ($pos !== false) {
	      $html_text = substr($html_text, 0, $pos);
	  } else {
	      $html_text = $html_text;
	  }	  
	  	  
	  ini_set("memory_limit","512M");  

	  $pathInfo = pathinfo(__FILE__);
	  $pathInfo['dirname'].'/../../../../../../';
	  
         include_once($pathInfo['dirname'].'/../../../../../../'.'/inc/nokogiri.php');
	  $html = new nokogiri($html_text);
	  	  
	  $trList = $html->get('table')->get('tr')->toArray();
	  $odd = false;
	  $result = array();
	  foreach($trList as $indx => $trRec) {
	      if (isset($trRec['bgcolor']) && ($trRec['bgcolor'] == 'f0f0f0' || $trRec['bgcolor'] == 'ffffff')) {
		      if (!$odd) {
				  $line = array();
				  if (isset($trRec['td'][1]['#text']) && 
				      isset($trRec['td'][2]['#text']) && 
					  isset($trRec['td'][3]['#text']) && 
					  isset($trRec['td'][7]['#text']) && 
					  isset($trRec['td'][8]['#text']) && 
					  isset($trRec['td'][9]['#text']) && 
					  isset($trRec['td'][10]['#text']) ) {
					  
					  $line['year']         = trim($trRec['td'][1]['#text']);
					  $line['mk']           = trim($trRec['td'][2]['#text']);
					  $line['ml']           = trim($trRec['td'][3]['#text']);
					  $line['mileage']      = trim($trRec['td'][7]['#text']);
					  $line['color']        = trim($trRec['td'][8]['#text']);
					  $line['vin']          = trim($trRec['td'][9]['#text']);
					  $line['auction-date'] = trim($trRec['td'][10]['#text']);
					  if (isset($trRec['td'][13]['a'][0]['onclick'])) {
					      $str = trim($trRec['td'][13]['a'][0]['onclick']);
						  $pos = strpos($str, "'");
						  if ($pos !== false) {
							  $str = substr($str, $pos+1);
							  
							  $pos = strpos($str, "'");
							  if ($pos !== false) {
								  $str = substr($str, 0, $pos);
							  }
						  }

						  $line['link'] = $str;
					  } elseif(isset($trRec['td'][13]['a'][0]['href'])) {
					      $line['link'] = trim($trRec['td'][13]['a'][0]['href']);
					  }
					  
					  if (!isset($line['link'])) $line['link'] = '';
					  
					  $result[] = $line;
				  }				  
			  }
			  
			  $odd = !$odd;
		  }
	  }

		foreach ($result AS $indx => $car_rec) {
			$url = $car_rec['link'];

			if (strpos($url, 'http://') === FALSE && $url != '')
			{
			   $url = $this->_config['domain'].$url;
			}

			$mileage = str_replace(',', '', $car_rec['mileage']);

			$mileage = (strpos($mileage, 'K') !== FALSE
			? floor((int) $mileage / 1.609344) // km. into ml.
			: (int) $mileage);                 // ml. into ml.

			$vincode = strtoupper($car_rec['vin']);
			$exterior = $car_rec['color'];

			$matches = array(
			   'vincode' => $vincode,
			   'mileage' => $mileage,
			   'color' => $exterior,
			   'series' => '',
			);

			if (Filter::factory($filters, $matches)->validate())
			{
			   $output[] = array(
				  'date_auction' => date('Y-m-d', strtotime($car_rec['auction-date'])),
				  'name' => $car_rec['ml'],
				  'vincode' => $vincode,
				  'mileage' => $mileage,
				  'exterior' => $exterior,
				  'url' => $url,
			   );
			}
		}
		
		return $output;
   }

   protected function _clearup($str)
   {
      return trim($str);
   }

   protected function _picture_exists($url, $vincode)
   {
      if ($url == '') return false;
	  
      $content = Remote::factory($url, $this->_remote_options)->execute();

      $picture_exists = ! preg_match('/Image Not Available/', $content);

      if (strpos($url, $this->_config['domain']) === FALSE)
      {
         $picture_exists = ! preg_match('#img/NoImage.gif#', $content);
      }

      if ($picture_exists)
      {
         Filecache::factory()
            ->set_url($url)
            ->set_path(strtoupper($vincode).'-ADESA')
            ->import($content);
      }

      return $picture_exists;
   }

   protected function _login()
   {
      if ($this->_is_logged())
         return TRUE;

      $login = Arr::get($this->_config, 'login');

      $options = $this->_remote_options + array(
         CURLOPT_POST => TRUE,
         CURLOPT_FOLLOWLOCATION => TRUE,
         CURLOPT_POSTFIELDS => http_build_query(Arr::get($login, 'post_fields')),
      );

      $response = Remote::factory(Arr::get($login, 'url'), $options)->execute();
      
      // $response = Remote::factory(Arr::get($login, 'redirect_url'), $this->_remote_options)->execute();
      
      return $this->_is_logged($response);
   }

   protected function _is_logged($response = FALSE)
   {
      $login = Arr::get($this->_config, 'login');
      

      if (! $response)
         $response = Remote::factory(Arr::get($login, 'redirect_url'), $this->_remote_options)->execute();
      
      if ((bool) preg_match('/'.Arr::get($login, 'ident').'/', $response))
      {
         Kohana::$log->add(Log::INFO, 'Authorized request');
         return TRUE;
      }

      return FALSE;
   }

}