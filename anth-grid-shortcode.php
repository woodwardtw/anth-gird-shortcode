<?php
/**
 * Plugin Name: ANTH 101 Grid shortcode
 * Plugin URI: https://github.com/woodwardtw/
 * Description: Shortcode to use JSON API to show posts [anth-posts cats="id,id,id" author="id,id" posts="1-99" load="true/false"]

 * Version: 1.7
 * Author: Tom Woodward
 * Author URI: http://bionicteaching.com
 * License: GPL2
 */
 
 /*   2016 Tom  (email : bionicteaching@gmail.com)
 
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.
 
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */
 


function anth_grid_enqueue_scripts() {
    wp_enqueue_style( 'anth-post-styles', plugins_url( '/css/anth-styles.css', __FILE__ )  ); 
    wp_enqueue_script( 'anth-post-scripts', plugins_url('/js/main.js', __FILE__), array( 'jquery' ), '1.0',true );

}
add_action( 'wp_enqueue_scripts', 'anth_grid_enqueue_scripts' );


 
function anth_grid_shortcode( $atts, $content = null ) {
    extract(shortcode_atts( array(
         'author' => '', //author id - sep multiple w commas
         'cats' => '', //cat id - sep multiple w commas    
         'posts' => '', //posts to return initially up to 99 
         'load' => '',        
    ), $atts));         

    if($author){
        $author = 'data-authors="'.$author.'"';
    } 
    if($cats){
        $cats = 'data-cats="'.$cats.'"';
    }
    if($posts) {
        $posts = 'data-posts="'.$posts.'"';
    }
    if($load) {
        $load = 'data-load="'.$load.'"';
    } else {
        $load = 'true';
    }
    
    $html = '<div id="anth-posts" class="container" '.$author. ' ' . $cats. ' ' . $load. ' ' . $posts .'></div>';
    $html .= '<div id="loading"><h2 class="blinker">loading . . .</h2> <div class="loader loader--style1" title="0"><svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/> </path></svg></div></div>';

    return  $html;
}

add_shortcode( 'anth-posts', 'anth_grid_shortcode' );