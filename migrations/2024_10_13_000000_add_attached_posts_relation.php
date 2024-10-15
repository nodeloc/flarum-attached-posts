<?php

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable('attached_posts', function (Blueprint $table) {
    $table->integer('post_id')->unsigned();
    $table->integer('attached_post_id')->unsigned();

    $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
    $table->foreign('attached_post_id')->references('id')->on('posts')->onDelete('cascade');
    
    $table->unique(['post_id', 'attached_post_id']);
});