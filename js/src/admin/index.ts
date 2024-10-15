import app from 'flarum/admin/app';

app.initializers.add('xypp/flarum-attached-posts', () => {
  app.extensionData.for('xypp-attached-posts')
    .registerSetting({
      setting: 'xypp-attached-posts.max-lines',
      type: 'number',
      label: app.translator.trans('xypp-attached-posts.admin.settings.max-lines'),
      help: app.translator.trans('xypp-attached-posts.admin.settings.max-lines'),
      min: 1,
    })
    .registerPermission({
      permission: 'discussion.xypp-attached-posts-use',
      label: app.translator.trans('xypp-attached-posts.admin.permissions.use'),
      icon: 'fas fa-paperclip'
    }, "start")
    .registerPermission({
      permission: 'discussion.xypp-attached-posts-moderate',
      label: app.translator.trans('xypp-attached-posts.admin.permissions.moderate'),
      icon: 'fas fa-paperclip'
    }, "moderate")
});
