import './AddItemsMenu.css';
import ModalWindow from '../../../shared-components/ModalWindow/ModalWindow';

const AddItemsMenu = props => {

  let addHeading = () => {
    props.addItem({
      content: '',
      width: 'eight',
      isInput: false,
      settingsCollapsed: true,
      type: 'heading',
      align: 'left',
      backgroundColor: "#FAFAFA",
      color: "#000000"
    });
  }

  let addParagraph = () => {
    props.addItem({
      content: '',
      width: 'eight',
      isInput: false,
      settingsCollapsed: true,
      type: 'paragraph',
      align: 'left'
    });
  }

  let addSpaceBlock = () => {
    props.addItem({
      width: 'eight',
      settingsCollapsed: true,
      type: 'spaceBlock',
      backgroundColor: "#FAFAFA"
    });
  }

  let addImage = () => {
    props.addItem({
      content: '',
      width: 'eight',
      isInput: false,
      type: 'image',
      settingsCollapsed: true
    });
  }

  let addYoutube = () => {
    props.addItem({
      content: '',
      width: 'eight',
      isInput: false,
      type: 'youtube',
      settingsCollapsed: true
    });
  }

  let style = { listStyle: 'none', width: '200px' };
  if (props.positionX) {
    style = { ...style, position: 'absolute', left: props.positionX, top: props.positionY }
  }

  return (
    <ModalWindow close={props.close}>
      <ul className='add-items-menu' style={style} onClick={props.close}>
        <li><button className="btn btn-list" onClick={addHeading}>Heading</button></li>
        <li><button className="btn btn-list" onClick={addParagraph}>Paragraph</button></li>
        <li><button className="btn btn-list" onClick={addSpaceBlock}>Space Block</button></li>
        <li><button className="btn btn-list" onClick={addImage}>Image</button></li>
        <li><button className="btn btn-list" onClick={addYoutube}>Youtube Video</button></li>
      </ul>
    </ModalWindow>
  );
}

export default AddItemsMenu;