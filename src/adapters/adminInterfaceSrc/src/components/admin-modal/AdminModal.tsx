import { component$, useStylesScoped$, $, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { PropFunction, Signal, TaskCtx } from '@builder.io/qwik'; // Corrected: VisibleTaskCtx to TaskCtx
import { DynamicForm, type EditorConfig } from '../dynamic-form/DynamicForm';
import styles from './AdminModal.css?inline';
import { API_URL } from '../../constants';

async function fetcherPost(url: string, data: any) {
  const rawdata = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!rawdata.ok) {
    const errorBody = await rawdata.text();
    throw new Error(`Fetcher POST failed with status: ${rawdata.status}. Body: ${errorBody}`);
  }
  return await rawdata.json();
}

interface AdminModalProps {
  isOpen: Signal<boolean>;
  title: string;
  initialData: Signal<Record<string, any>>;
  editorConfig: EditorConfig;
  usedEditorIdentifier: string;
  onClose$: PropFunction<() => void>;
}

export const AdminModal = component$<AdminModalProps>((props) => {
  useStylesScoped$(styles);
  const isSaving = useSignal(false);
  const localFormData = useSignal<Record<string, any>>({ ...props.initialData.value });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$((ctx: TaskCtx) => { // Corrected: VisibleTaskCtx to TaskCtx
    ctx.track(() => props.initialData.value);
    localFormData.value = { ...props.initialData.value };
  });

  const handleSave = $(async () => {
    isSaving.value = true;
    try {
      const currentPath = window.location.pathname;
      const payloadData: Record<string, any> = {};

      for (const key in localFormData.value) {
        const value = localFormData.value[key];
        const fieldConfig = props.editorConfig[key];
        
        if (fieldConfig.element === 'html' && typeof value === 'object' && value !== null && 'blocks' in value) {
          payloadData[key] = value; 
        } else {
          payloadData[key] = value;
        }
      }

      const componentName = props.usedEditorIdentifier.split('.')[0];

      const result = {
        component: componentName, // Added component field
        editorData: props.usedEditorIdentifier,
        data: payloadData,
        url: currentPath,
      };

      console.log("Saving data:", JSON.stringify(result, null, 2));
      const response = await fetcherPost(`${API_URL}/update-partial`, result);
      console.log("Save successful:", response);
      props.onClose$();
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Save failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      isSaving.value = false;
    }
  });

  if (!props.isOpen.value) {
    return null;
  }

  return (
    <div class="modal-overlay" onClick$={(e) => {
      if (!isSaving.value && (e.target as HTMLElement).classList.contains('modal-overlay')) {
        props.onClose$();
      }
    }}>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{props.title}</h3>
          <button onClick$={props.onClose$} disabled={isSaving.value}>&times;</button>
        </div>
        <div class="modal-body">
          <DynamicForm
            editorConfig={props.editorConfig}
            formDataSignal={localFormData}
          />
        </div>
        <div class="modal-footer">
          <button type="button" onClick$={props.onClose$} disabled={isSaving.value}>Cancel</button>
          <button type="button" class="primary" onClick$={handleSave} disabled={isSaving.value}>
            {isSaving.value ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
});
