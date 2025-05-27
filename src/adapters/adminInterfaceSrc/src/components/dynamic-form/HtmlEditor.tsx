import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import EditorJS, { type OutputData, type BlockToolData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

interface HtmlEditorProps {
  editorId: string;
  initialValue: string | OutputData | undefined; 
  fieldName: string;
  onChange$: PropFunction<(data: OutputData) => void>;
}

export const HtmlEditor = component$<HtmlEditorProps>((props) => {

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup, track }) => {
    track(() => props.editorId); 
    track(() => props.initialValue); 

    let initialBlocks: BlockToolData[] = []; // Explicitly type initialBlocks
    if (typeof props.initialValue === 'string') {
      initialBlocks = [{ type: 'paragraph', data: { text: props.initialValue } }];
    } else if (props.initialValue && typeof props.initialValue === 'object' && 'blocks' in props.initialValue) {
      initialBlocks = (props.initialValue as OutputData).blocks;
    }

    const editor = new EditorJS({
      holder: props.editorId,
      tools: {
        header: Header as any,
        list: List as any,
        paragraph: {
          class: Paragraph as any,
          inlineToolbar: true,
        },
      },
      data: {
        blocks: initialBlocks,
      },
      autofocus: false,
      minHeight: 150,
      async onChange() { 
        const savedData = await editor.save();
        props.onChange$(savedData);
      },
    });

    cleanup(() => {
      if (typeof editor.destroy === 'function') {
        editor.destroy();
      }
    });
  }, { strategy: 'document-ready' });

  return (
    <div id={props.editorId} class="editorjs-container"></div>
  );
});
