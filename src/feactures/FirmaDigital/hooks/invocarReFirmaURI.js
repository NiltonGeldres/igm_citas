export const invocarReFirmaURI = () => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'refirma://abrir';
  document.body.appendChild(iframe);
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 2000);
};