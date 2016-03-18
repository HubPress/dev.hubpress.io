import React from 'react';
import Paper from 'material-ui/lib/paper';

function applyScript(initialChange, hasChanged) {
  if (!hasChanged)
    return;

  let element = document.getElementById("asciidoc-render");
  let scripts = element.getElementsByTagName("script");
  let addedScripts = [];
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src != "" && addedScripts.indexOf(scripts[i].src) === -1) {
      let tag = document.createElement("script");
      tag.src = scripts[i].src;
      addedScripts.push(tag.src);
      document.getElementsByTagName("head")[0].appendChild(tag);
    }
    else {
      eval(scripts[i].innerHTML);
    }
  }

  if (window.instgrm)
    window.instgrm.Embeds.process();

  if (this.props.onChange){
    this.props.onChange(this.convertedPost, initialChange);
  }
}

class Preview extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.applyScript = applyScript.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const initialChange = !prevProps.content;
    const hasChanged = prevProps.content != this.props.content;
    // Update component only if necessary
    this.applyScript(initialChange, hasChanged);
  }

  render() {
    //this.convertedPost = convertContent(this.props.content || '');
    const htmlContent = this.props.content;
    const title = this.props.title;
    const tags = this.props.tags || 'No tag';
    let tagsComponent = '';

    if (tags) {
      tagsComponent = (<p><strong>Tags:</strong> {tags}</p>);
    }

    return (
      <div id="asciidoc-render" className={this.props.className}>
        <div className={"post-content"}>
          <h1>{title}</h1>
          {tagsComponent}
          <hr />
          <div ref="content"  dangerouslySetInnerHTML={{__html: htmlContent}}>
          </div>
        </div>
      </div>
    );
  }
}

export default Preview;
