import React from 'react';

class View2 extends React.Component {
    render() {
        return (
            <div>
                <p>I am view2</p>
                <p>route: {this.props.match.path}</p>
            </div>
        )
    }
}

export default View2
