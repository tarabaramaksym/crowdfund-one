const RenderStaticPage = props => {

  const render = () => {
    return props.elements.map((e, index) => {
      let component = '';
      switch (e.elementType.name) {
        case 'mainHeading':
          component = <div style={{ width: '100%' }}><h1 className='item'
            style={{ textAlign: e.textAlign.name, width: '100%', backgroundColor: e.backgroundColor.colorHTML, color: e.color.colorHTML }} >{e.content}</h1></div>;
          break;
        case 'heading':
          component = <div style={{ width: '100%' }}><h3 className='item'
            style={{ textAlign: e.textAlign.name, width: '100%', backgroundColor: e.backgroundColor.colorHTML, color: e.color.colorHTML }} >
            {e.content}
          </h3></div>;
          break;
        case 'paragraph':
          component = <div style={{ width: '100%' }}> <pre><p className='item' style={{ textAlign: e.textAlign.name, width: '100%' }} >
            {e.content}</p>
          </pre></div>;
          break;
        case 'spaceBlock':
          component = <div style={{ width: '100%' }}><div className='block' style={{ backgroundColor: e.backgroundColor.colorHTML, width: '100%', height: e.width.name === 'four' ? '75px' : 'auto' }}></div></div>;
          break;
        case 'youtube':
          component = <div style={{ width: '100%' }}><iframe src={e.content || 'https://www.youtube.com/embed/ITBMT-sUeH0'} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>;
          break;
        case 'image':
          component = <div style={{ width: '100%' }}><div><img className='item'
            src={e.content ||
              'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png'}>
          </img></div></div>;
          break;

      }
      return (<div key={index} className={`item-container ${e.width.name || 'four'}`} >
        {component}
      </div>)

    });
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="campaigns-container sub">
        <div className="form-container">
          <div className="form">  {render()}</div>
        </div>
      </div>
    </div>

  )

}

export default RenderStaticPage;