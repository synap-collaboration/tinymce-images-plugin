function initPlugin() {
  const onFileInput = function(editor, file) {
    // We use TinyMCE's editor.dom here (rather than document.createElement) as it is empirically more reliable within the editor
    const img = editor.dom.create('img', {id: `tinymce-new-image-${file.name}`});
    if (!img && honeybadger) {
      honeybadger.notify({ desc: 'Could not create img tag', fileObj: file });
    }
    editor.selection.setNode(img);

    // Get Base64 data of the image so that the user sees the image right away
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result;
      const img = editor.dom.select(`*[id="tinymce-new-image-${file.name}"]`)[0];
      if (!img && honeybadger) {
        honeybadger.notify({ desc: 'Could not find img after reading base64 data', fileObj: file });
      }
      img.setAttribute('src', base64Data);

      const handler = editor.getParam('images_upload_handler');
      handler(
        file,
        (url) => {
          const img = editor.dom.select(`*[id="tinymce-new-image-${file.name}"]`)[0];
          
          // If the user deletes the image before the upload completes, img won't exist
          if (img) {
            img.setAttribute('src', url);
            img.removeAttribute('id');
          }
        },
        (err) => {
          editor.dom.remove(`*[id="tinymce-new-image-${file.name}"]`);
          editor.getParam('image_conversion_error_handler')();
        }
      );
    }

    reader.onerror = () => {
      reader.abort()
      if (honeybadger) {
        honeybadger.notify({ desc: 'Failed to read base64 image data', fileObj: file });
      }
      editor.dom.remove(`*[id="tinymce-new-image-${file.name}"]`);
      editor.getParam('image_conversion_error_handler')();
    }
  }

  tinymce.create('tinymce.plugins.SynapImages', {

    init: function (ed) {
        ed.addButton('upload-button', {
            icon: 'image',
            tooltip: 'Insert an image',
            onClick: function (e) {
              const input = document.createElement('input');

              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              input.onclick = function(e) {
                this.value = null;
              }

              input.onchange = (e) => {
                e.preventDefault();
                const files = e.target.files;

                if (files.length && files.length > 0) {
                  onFileInput(ed, files[0]);
                }
              }

              input.click();
            }
        });
    },

    getInfo: function () {
        return {
            longname: 'synap-images',
            author: 'Jesse Cooper',
            version: tinymce.majorVersion + '.' + tinymce.minorVersion
        };
    }
  });

  tinymce.PluginManager.add('synap-images', tinymce.plugins.SynapImages);
};

initPlugin();