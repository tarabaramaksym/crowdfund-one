export default function SpaceBlock(props) {
  return (
    <div className='block' style={{ backgroundColor: props.item.backgroundColor, width: '100%', minHeight: '40px', border: '1px dashed black', height: props.item.width === 'four' ? '75px' : 'auto' }}></div>
  )
}

