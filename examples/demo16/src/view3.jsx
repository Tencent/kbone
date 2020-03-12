import React from 'react';

class View3 extends React.Component {
    render() {
        return (
            <div>
                <p>I am view3</p>
                <p>route: {this.props.match.path}</p>
            </div>
        )
    }
}

export default View3
