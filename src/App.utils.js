import html2canvas from 'html2canvas';

export const generateTableImage = (taskLists, selTaskList) => {
  // taskTable is the id of our TaskTable container div
  html2canvas(document.querySelector('#taskListTable')).then(canvas => {
    // If the user is using IE/Edge browsers
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(
        canvas.msToBlob(),
        `TASKLIST: ${taskLists[selTaskList].title}.png`
      );
    } else {
      // If the user uses Chrome, FireFox, etc...
      const a = document.createElement('a');

      document.body.appendChild(a);
      a.href = canvas.toDataURL();
      a.download = `TASKLIST: ${taskLists[selTaskList].title}.png`;
      a.click();
      document.body.removeChild(a);
    }
  });
};
