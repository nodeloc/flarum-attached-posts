import app from 'flarum/forum/app';
import addAttachComponents from './addAttachComponents';

app.initializers.add('xypp/flarum-attached-posts', () => {
  addAttachComponents();
});
