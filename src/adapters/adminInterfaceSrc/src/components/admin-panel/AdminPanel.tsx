import { component$, useSignal, useStylesScoped$, $ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import styles from './AdminPanel.css?inline';
import { AdminModal } from '../admin-modal/AdminModal';
import type { EditorConfig } from '../dynamic-form/DynamicForm';
import { authService } from '../../services/AuthService';

interface AdminPanelProps {
  onLogout$: PropFunction<() => void>;
}

// Mock data simulating what might come from pageData and editorData
const pageSettingsData = {
  siteName: "My Qwik Site",
  defaultLanguage: "en-US",
  metaDescription: "A fantastic site built with Qwik!",
  faviconUrl: "/favicon.ico",
  isAnalyticsEnabled: true,
  footerHtml: "<p>Copyright 2024. All rights reserved.</p>"
};

const pageSettingsEditorConfig: EditorConfig = {
  siteName: { element: "string" },
  defaultLanguage: { element: "enum", options: ["en-US", "es-ES", "fr-FR"] },
  metaDescription: { element: "string?" }, // Optional
  faviconUrl: { element: "urlPicker" },
  isAnalyticsEnabled: { element: "boolean" },
  footerHtml: {element: "html"}
};

const headData = {
  pageTitle: "Homepage - My Qwik Site",
  metaKeywords: "qwik, javascript, framework, fast",
  customScript: "<script>console.log('Head script');</script>"
};

const headEditorConfig: EditorConfig = {
  pageTitle: { element: "string" },
  metaKeywords: { element: "string" },
  customScript: {element: "html"}
};


export const AdminPanel = component$<AdminPanelProps>((props) => {
  useStylesScoped$(styles);

  const isActive = useSignal(false);
  const isPanelVisible = useSignal(false);
  const isModalOpen = useSignal(false);
  
  // Signal to hold the data for the currently open modal
  const currentModalData = useSignal<Record<string, any>>({});
  // Signal to hold the editor config for the currently open modal
  const currentEditorConfig = useSignal<EditorConfig>({});
  // Signal to hold the title for the currently open modal
  const currentModalTitle = useSignal("Edit Data");
  // Signal to hold the identifier for the save operation
  const currentUsedEditorIdentifier = useSignal("unknown");


  const openModalWithData = $((
    title: string, 
    data: Record<string, any>, 
    config: EditorConfig,
    identifier: string
  ) => {
    currentModalTitle.value = title;
    currentModalData.value = JSON.parse(JSON.stringify(data)); // Deep copy for editing
    currentEditorConfig.value = config;
    currentUsedEditorIdentifier.value = identifier;
    isModalOpen.value = true;
  });

  const handleModalClose = $(() => {
    isModalOpen.value = false;
  });

  return (
    <>
      <editor data-active={isActive.value} data-visible={isPanelVisible.value}>
        <label class="toggle-switch">
          <input type="checkbox" id="mainSwitch" bind:checked={isActive} />
          <span class="slider"></span>
        </label>
        <button
          id="showHide"
          onClick$={() => isPanelVisible.value = !isPanelVisible.value}
        >
          &lt;
        </button>
        <aside hidden={!isPanelVisible.value}>
          <p>Aside Content</p>
          <button 
            id="ps" 
            onClick$={() => openModalWithData("Page Settings", pageSettingsData, pageSettingsEditorConfig, "pageSettings")}
          >
            Page Settings
          </button>
          <button 
            id="head"
            onClick$={() => openModalWithData("Head Content", headData, headEditorConfig, "head")}
          >
            head
          </button>
          <button id="add">Add Page</button>
          <button id="deploy">deploy</button>
          <button id="logout" onClick$={async () => {
            await authService.logout();
            props.onLogout$();
          }}>Logout</button>
        </aside>
      </editor>

      {isModalOpen.value && (
        <AdminModal
          isOpen={isModalOpen}
          title={currentModalTitle.value}
          initialData={currentModalData} // Pass the signal directly
          editorConfig={currentEditorConfig.value}
          usedEditorIdentifier={currentUsedEditorIdentifier.value}
          onClose$={handleModalClose}
        />
      )}
    </>
  );
});
