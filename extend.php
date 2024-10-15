<?php

/*
 * This file is part of flarum/attached-posts.
 *
 * Copyright (c) 2024 小鱼飘飘.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Xypp\AttachedPosts;

use Flarum\Api\Controller\ListPostsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Controller\ShowPostController;
use Flarum\Api\Controller\UpdateDiscussionController;
use Flarum\Api\Controller\UpdatePostController;
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Extend;
use Flarum\Http\RequestUtil;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use Xypp\AttachedPosts\Listener\SaveAttachedPost;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),
    new Extend\Locales(__DIR__ . '/locale'),
    (new Extend\Model(Post::class))
        ->belongsToMany("attached_posts", Post::class, "attached_posts", "post_id", "attached_post_id"),
    (new Extend\ApiSerializer(BasicPostSerializer::class))
        ->hasMany('attached_posts', BasicPostSerializer::class),
    (new Extend\ApiController(ListPostsController::class))
        ->addInclude('attached_posts'),
    (new Extend\ApiController(ShowPostController::class))
        ->addInclude('attached_posts'),
        (new Extend\ApiController(ShowDiscussionController::class))
        ->addInclude('posts.attached_posts'),
        (new Extend\ApiController(UpdateDiscussionController::class))
        ->addInclude('posts.attached_posts'),
    (new Extend\ApiController(UpdatePostController::class))
        ->addInclude('attached_posts'),
    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attribute('xypp-attached-posts-use', function (DiscussionSerializer $serializer, $model, $attrs) {
            return RequestUtil::getActor($serializer->getRequest())->can('xypp-attached-posts-use', $model);
        })
        ->attribute('xypp-attached-posts-moderate', function (DiscussionSerializer $serializer, $model, $attrs) {
            return RequestUtil::getActor($serializer->getRequest())->can('xypp-attached-posts-moderate', $model);
        }),
    (new Extend\Settings)
        ->default('xypp-attached-posts.max-lines', 5)
        ->serializeToForum('xypp-attached-posts.max-lines','xypp-attached-posts.max-lines'),
    (new Extend\Event())
        ->listen(Saving::class, SaveAttachedPost::class)
];
