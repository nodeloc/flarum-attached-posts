import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import username from 'flarum/common/helpers/username';
import userOnline from 'flarum/common/helpers/userOnline';
import Link from 'flarum/common/components/Link';
import classList from 'flarum/common/utils/classList';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import ItemList from 'flarum/common/utils/ItemList';
import Discussion from 'flarum/common/models/Discussion';
import humanTime from 'flarum/common/helpers/humanTime';
import Button from 'flarum/common/components/Button';

export default class AttachedPostPreviewer extends Component<{
    post: Post,
    parentPost: Post
}> {
    showMore: boolean = false;
    removing: boolean = false;
    oninit(vnode: any) {
        super.oninit(vnode);
    }
    view() {
        const maxLines = app.forum.attribute<number>('xypp-attached-posts.max-lines');
        const currentUser = app.session?.user;
        const postUser = this.attrs.post.user();
        let canDelete = false;
        if (currentUser && postUser && currentUser.id() !== postUser.id()) {
            if (this.attrs.post.discussion().attribute("xypp-attached-posts-moderate")) {
                canDelete = true;
            }
        } else if (this.attrs.post.discussion().attribute("xypp-attached-posts-use")) {
            canDelete = true;
        }
        return (
            <div className="CommentPost">
                <div className="Post-header">
                    <div className="AttachTitle" onclick={() => app.current.get('stream').goToNumber(this.attrs.post.number())}>
                        <i class="fas fa-paperclip"></i>
                        {app.translator.trans("xypp-attached-posts.forum.attached")}
                    </div>
                    <div className="PostUser">
                        {postUser && userOnline(postUser)}
                        <h3>{postUser ? <Link href={app.route.user(postUser)}>{username(postUser)}</Link> : username(postUser)}</h3>
                    </div>
                </div>
                <div className={classList('Post-body', maxLines > 0 && 'attached-post', (!this.showMore) && "truncate")} style={{ '--max-lines': maxLines }}>
                    <div className='Post-body-wrapper'>
                        {m.trust(this.attrs.post.contentHtml())}
                    </div>
                </div>
                <div className="AttachedPost-footer" onclick={(() => { this.showMore = !this.showMore; m.redraw() }).bind(this)}>
                    {this.showMore ? (
                        [
                            <i className="fas fa-angle-up" />,
                            app.translator.trans("xypp-attached-posts.forum.show-less")
                        ]
                    ) : (
                        [
                            <i className="fas fa-angle-down" />,
                            app.translator.trans("xypp-attached-posts.forum.show-more")
                        ]
                    )}
                </div>

                {canDelete ?
                    <Button className="attached-posts-delete Button" icon="fas fa-trash" onclick={this.unattach.bind(this)} loading={this.removing} disabled={this.removing}>
                        {app.translator.trans("xypp-attached-posts.forum.delete")}
                    </Button>
                    : ""
                }
            </div>
        );
    }

    unattach(e: MouseEvent) {
        e.preventDefault();
        this.removing = true;
        m.redraw();
        this.attrs.parentPost.save({
            unattach_post: this.attrs.post.id()
        }).then(() => m.redraw());
    }
}