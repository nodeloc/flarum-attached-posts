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
import AttachedPostPreviewer from './AttachedPostPreviewer';


export default class AttachContainer extends Component<{
    post: Post;
}> {
    oninit(vnode: any) {
        super.oninit(vnode);
    }

    view() {
        const selectForTarget = this.attrs.post.discussion().attribute<string>('xypp-attached-posts.select_for_target');
        const attached = this.attrs.post.attached_posts();
        return (
            <div className="AttachContainer">
                {
                    (attached && attached.length) ?
                        attached.map(p => <AttachedPostPreviewer post={p} parentPost={this.attrs.post} ></AttachedPostPreviewer>)
                        :
                        ""
                }
                {
                    (selectForTarget && selectForTarget != this.attrs.post.id()) ? (
                        <div className="AttachContainer-select">
                            <span>
                                {app.translator.trans("xypp-attached-posts.forum.attach")}
                            </span>
                            <Button onclick={this.attachToCurrent.bind(this)} className='Button Button--primary'>{app.translator.trans("xypp-attached-posts.forum.attach-btn")}</Button>
                        </div>
                    ) : ""
                }
            </div>
        );
    }

    attachToCurrent(e: MouseEvent) {
        e.preventDefault();
        const selectForTarget = this.attrs.post.discussion().attribute<number>('xypp-attached-posts.select_for_target');
        this.attrs.post.discussion().pushAttributes({ 'xypp-attached-posts.select_for_target': null });
        m.redraw();
        this.attrs.post.save({
            attach_post: selectForTarget
        }).then(()=>m.redraw());
    }
}