import { component$, useStylesScoped$, useSignal, $ } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import styles from './DynamicForm.css?inline';
import { HtmlEditor } from './HtmlEditor';
import { API_URL } from '../../constants'; // Import API_URL
import type { OutputData } from '@editorjs/editorjs';

export interface EditorConfig {
  [fieldName: string]: {
    element: string;
    options?: string[];
  };
}

interface DynamicFormProps {
  editorConfig: EditorConfig;
  formDataSignal: Signal<Record<string, any>>; // Signal to hold form data
}

async function fetcherGet(url: string) {
  const rawdata = await fetch(url);
  if (!rawdata.ok) throw new Error(`Fetcher GET failed with status: ${rawdata.status}`);
  return await rawdata.json();
}


export const DynamicForm = component$<DynamicFormProps>((props) => {
  useStylesScoped$(styles);
  const siteTree = useSignal<string[]>([]);
  const showUrlPickerFor = useSignal<string | null>(null); // fieldName for which picker is open

  const handleUrlSelect = $((url: string, fieldName: string) => {
    props.formDataSignal.value = {
      ...props.formDataSignal.value,
      [fieldName]: url,
    };
    showUrlPickerFor.value = null; // Close picker
  });

  const openUrlPicker = $(async (fieldName: string) => {
    try {
      const pages = await fetcherGet(`${API_URL}/siteTree`);
      siteTree.value = pages;
      showUrlPickerFor.value = fieldName;
    } catch (error) {
      console.error("Failed to fetch site tree:", error);
      alert("Could not load page list.");
    }
  });


  return (
    <form class="dynamic-form" preventdefault:submit>
      {Object.entries(props.editorConfig).map(([fieldName, config]) => {
        let isOptional = false;
        let elementType = config.element;
        const editorId = `editorjs-${fieldName}`;

        if (elementType.endsWith('?')) {
          isOptional = true;
          elementType = elementType.slice(0, -1);
        }
        
        const currentValue = props.formDataSignal.value[fieldName];

        return (
          <article key={fieldName}>
            <label for={elementType === 'html' ? editorId : fieldName}>{fieldName}{isOptional ? "" : "*"}</label>
            {elementType === 'string' && (
              <input
                type="text"
                id={fieldName}
                name={fieldName}
                value={currentValue}
                onInput$={(e) => {
                  props.formDataSignal.value = { ...props.formDataSignal.value, [fieldName]: (e.target as HTMLInputElement).value };
                }}
              />
            )}
            {elementType === 'number' && (
              <input
                type="number"
                id={fieldName}
                name={fieldName}
                value={currentValue}
                onInput$={(e) => {
                  props.formDataSignal.value = { ...props.formDataSignal.value, [fieldName]: parseFloat((e.target as HTMLInputElement).value) };
                }}
              />
            )}
            {elementType === 'boolean' && (
              <input
                type="checkbox"
                id={fieldName}
                name={fieldName}
                checked={currentValue}
                onChange$={(e) => {
                  props.formDataSignal.value = { ...props.formDataSignal.value, [fieldName]: (e.target as HTMLInputElement).checked };
                }}
              />
            )}
            {elementType === 'enum' && (
              <select
                id={fieldName}
                name={fieldName}
                value={currentValue}
                onChange$={(e) => {
                  props.formDataSignal.value = { ...props.formDataSignal.value, [fieldName]: (e.target as HTMLSelectElement).value };
                }}
              >
                {config.options?.map((option) => (
                  <option key={option} value={option} selected={currentValue === option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {elementType === 'urlPicker' && (
              <div class="url-picker-container">
                <input
                  type="url"
                  id={fieldName}
                  name={fieldName}
                  value={currentValue}
                  onInput$={(e) => {
                    props.formDataSignal.value = { ...props.formDataSignal.value, [fieldName]: (e.target as HTMLInputElement).value };
                  }}
                />
                <button type="button" onClick$={() => openUrlPicker(fieldName)}>
                  Choose Page
                </button>
                {showUrlPickerFor.value === fieldName && siteTree.value.length > 0 && (
                  <div class="url-picker-dropdown">
                    <select
                      size={4}
                      onInput$={(e) => handleUrlSelect((e.target as HTMLSelectElement).value, fieldName)}
                    >
                      {siteTree.value.map(page => <option key={page} value={page}>{page}</option>)}
                    </select>
                    <button type="button" onClick$={() => showUrlPickerFor.value = null}>Close</button>
                  </div>
                )}
              </div>
            )}
            {elementType === 'html' && (
              <HtmlEditor
                editorId={editorId}
                initialValue={currentValue as string | OutputData | undefined}
                fieldName={fieldName}
                onChange$={$((data: OutputData) => {
                  props.formDataSignal.value = { ...props.formDataSignal.value, [fieldName]: data };
                })}
              />
            )}
          </article>
        );
      })}
    </form>
  );
});
