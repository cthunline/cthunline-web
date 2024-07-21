// bring the given widget element forward by sorting widgets z-indexes
// eslint-disable-next-line import/prefer-default-export
export const focusWidget = (target: HTMLElement) => {
    const reactDragClass = '.react-draggable';
    // widget to bring forward
    const thisWidget = target.closest(reactDragClass) as HTMLElement;
    // all other widget displayed
    const allOtherWidgets = [
        ...document.querySelectorAll(reactDragClass)
    ].filter((w) => w.id !== thisWidget.id);
    // sort all other widgets by their current z-index
    allOtherWidgets.sort((el1, el2) => {
        const el1ZIndex = Number(el1.getAttribute('data-zindex'));
        const el2ZIndex = Number(el2.getAttribute('data-zindex'));
        if (el1ZIndex < el2ZIndex) {
            return -1;
        }
        if (el1ZIndex > el2ZIndex) {
            return 1;
        }
        return 0;
    });
    // set correct ordered z-index on other widgets
    let zIndex = 1;
    for (let index = 0; index < allOtherWidgets.length; index++) {
        const widgetEl = allOtherWidgets[index] as HTMLElement;
        widgetEl.setAttribute('data-zindex', zIndex.toString());
        widgetEl.style.zIndex = zIndex.toString();
        zIndex += 1;
    }
    // set max z-index on widget to bring forward
    thisWidget.setAttribute('data-zindex', zIndex.toString());
    thisWidget.style.zIndex = zIndex.toString();
};
