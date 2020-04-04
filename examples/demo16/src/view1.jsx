import React from 'react';

class View1 extends React.Component {
    render() {
        return (
            <div>
                <p>I am view1</p>
                <p>route: {this.props.match.path}</p>
            </div>
        )
    }
}

export default View1
