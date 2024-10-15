<?php

namespace Xypp\AttachedPosts\Listener;
use Flarum\Post\Event\Saving;
use Illuminate\Support\Arr;

class SaveAttachedPost
{

    public function __invoke(Saving $event)
    {
        if ($toBeAttachedId = Arr::get($event->data, 'attributes.attach_post')) {
            $this->canAttach($event);
            /**
             * @var \Illuminate\Database\Eloquent\Relations\BelongsToMany
             */
            $attached = $event->post->attached_posts();

            if (!$attached->where('attached_post_id', $toBeAttachedId)->exists()) {
                $attached->attach($toBeAttachedId);
            }
        }

        if ($toUnattachedId = Arr::get($event->data, 'attributes.unattach_post')) {
            $this->canAttach($event);
            /**
             * @var \Illuminate\Database\Eloquent\Relations\BelongsToMany
             */
            $attached = $event->post->attached_posts();

            if ($attached->where('attached_post_id', $toUnattachedId)->exists()) {
                $attached->detach($toUnattachedId);
            }
        }
    }

    private function canAttach(Saving $event)
    {
        if ($event->post->user_id != $event->actor->id)
            $event->actor->assertCan('xypp-attached-posts-moderate', $event->post->discussion);
        else
            $event->actor->assertCan('xypp-attached-posts-use', $event->post->discussion);
    }
}