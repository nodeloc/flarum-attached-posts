import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import AttachContainer from './components/AttachContainer';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';
import Post from 'flarum/common/models/Post';
import Model from 'flarum/common/Model';

export default function addAttachComponents() {
    Post.prototype.attached_posts = Model.hasMany<Post>('attached_posts');

    extend(CommentPost.prototype, 'footerItems', function (items) {
        items.add('attached-posts', <AttachContainer post={this.attrs.post} />);
    });

    extend(PostControls, 'moderationControls', function (items, post) {
        const discussion = post.discussion();
        const postUser = post.user();
        const currentUser = app.session?.user;
        let show = false;
        if (currentUser && postUser && currentUser.id() !== postUser.id()) {
            if (discussion.attribute("xypp-attached-posts-moderate")) {
                show = true;
            }
        } else if (discussion.attribute("xypp-attached-posts-use")) {
            show = true;
        }

        if (show) {
            items.add('xypp-attached-posts', Button.component({
                icon: 'fas fa-paperclip',
                className: 'Button Button--link',
                onclick: () => {
                    discussion.pushAttributes({
                        'xypp-attached-posts.select_for_target': post.id()
                    });
                    m.redraw();
                }
            },
                app.translator.trans('xypp-attached-posts.forum.attach-btn'))
            )
        }
    });
}