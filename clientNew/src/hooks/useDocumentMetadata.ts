import { useRef, useEffect } from 'react';

const useDocumentMetadata = (title: string, description: string, prevailOnUnmount = false) => {
  const defaultTitle = useRef(document.title);
  const defaultDescription = useRef('');

  const handleAddMetaOptions = (name: string, data: string) => {
    const newMeta = document.createElement('meta');
    newMeta.name = name;
    newMeta.content = data;
    document.head.appendChild(newMeta);
  }

  useEffect(() => {
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      defaultDescription.current = metaDescription.getAttribute('content') || '';
      metaDescription.setAttribute('content', description);
    } else {
      defaultDescription.current = '';

      handleAddMetaOptions('description', description)
      handleAddMetaOptions('title', title)
    }
  }, [title, description]);

  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = defaultTitle.current;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription.current);
      }
    }
  }, []);
};

export default useDocumentMetadata;