import React from 'react';
import ReactDOM from 'react-dom';

import '../node_modules/bootstrap-jquery/dist/css/bootstrap.min.css';
import './index.css';

const MAX_VALUE = 50;
const MIN_VALUE = -50;

const API_URL = 'http://dataservice.accuweather.com/currentconditions/v1/1-324505_1_AL';
const API_KEY = 'A7eAEd7dOqt7AuyWdGn3uWBCQnQ8z6Nj';

function valueToPercent(value){
    return ((value - MIN_VALUE) * 100) / (MAX_VALUE - MIN_VALUE)
}

class ForecastWidgetControls extends React.Component{

    render (){
        return (
            <div className="controls">
                <div className="formGroup">
                    <label htmlFor="bg-color">Background color, hex</label>
                    <input type="text" className="form-control" name="color" defaultValue={this.props.color} />
                </div>
                <div className="formGroup">
                    <label htmlFor="thermo-height">Thermometer height, px</label>    
                    <input type="text" className="form-control" name="height" defaultValue={this.props.height} />
                </div>
                <div className="formGroup">
                    <label htmlFor="thermo-value">Thermometer value, &deg;C</label>    
                    <input type="text" className="form-control" name="value" defaultValue={this.props.value} />
                </div>
                <button className="btn btn-default" name="setValues">Set values</button>
            </div>
        )
    }
}

class ForecastWidgetThermometer extends React.Component{

    render(){
        return (
            <div className="thermo">
                <div className="thermometr" style={{height: this.props.height+'px', 'backgroundColor': this.props.color}}>
                    <span className="thermometr-value"><span>{this.props.value}</span>&deg;C</span>
                    <div className="column" style={{height: valueToPercent(this.props.value)+'%'}}></div>
                    <div className="base"></div>
                </div>
            </div>
        )
    }
}

class ForecastWidget extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {color: '#aaa', value: 0, height: 300}
        this.tmpValues = Object.assign({}, this.state)
    }
    
    componentDidMount(){
        /*fetch(API_URL+'?apikey='+API_KEY)
            .then((response) => response.json())
            .then((response) => this.setState({value: parseInt(response[0].Temperature.Metric.Value, 10)}))*/
        this.setState({value: 27})
    }
    
    handleOnChange(e){
        if (['value', 'height', 'color'].indexOf(e.target.name) > -1){
            this.tmpValues[e.target.name] = e.target.value
        }
    }
    
    handleOnClick(e){
        if (e.target.name === 'setValues'){
            this.setState(this.tmpValues);
        }
    }

    render(){
        return (
            <div className="forecast-widget" onChange={this.handleOnChange.bind(this)} onClick={this.handleOnClick.bind(this)}>
                <ForecastWidgetThermometer {...this.state} />
                <ForecastWidgetControls {...this.state} />
            </div>
        )
    }
}

ReactDOM.render(
    <ForecastWidget />,
    document.getElementById('root')
);