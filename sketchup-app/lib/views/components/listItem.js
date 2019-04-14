import React from 'react';

const ListItem = ((props) => {
	return (
    <div className="sketch-item" onClick={() => props.onItemClick(props.sketchId)}>
      <div className="sketch-thumbnail"><img class="thumbnail-image" src="build/images/picture-icon.png"></img></div>
      <div className="sketch-name">{props.sketchName}</div>
    </div>
	  );
});

ListItem.displayName = 'ListItem';

export default ListItem;