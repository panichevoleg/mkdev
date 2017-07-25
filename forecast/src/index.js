import $ from 'jquery';
import bootstrap from 'bootstrap-jquery';

import React from 'react';
import ReactDOM from 'react-dom';

import '../node_modules/bootstrap-jquery/dist/css/bootstrap.min.css';
import './index.css';

class ForecastWidgetControls extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            height: this.props.height,
            color: this.props.color,
            value: this.props.value
        }
        
        this.onChangeHeight = this.onChangeHeight.bind(this)
        this.onChangeValue = this.onChangeValue.bind(this)
        this.onChangeColor = this.onChangeColor.bind(this)
        this.onClickSetValues = this.onClickSetValues.bind(this)
    }
    
    onChangeHeight(e){
        if (e.target.value == parseInt(e.target.value)){
            this.setState({height: e.target.value})
        }
    }
    
    onChangeValue(e){
        if (e.target.value == parseInt(e.target.value)){
            this.setState({value: e.target.value})
        }
    }
    
    onChangeColor(e){
        this.setState({color: e.target.value})
    }
    
    onClickSetValues(){
        let data = {
            bgColor: this.refs.bgColor.value,
            thermoHeight: this.refs.thermoHeight.value,
            thermoValue: this.refs.thermoValue.value
        };
        this.props.onChangeValues(data)
    }
    
    componentWillReceiveProps(nextProps){
        if (this.props.value != nextProps.value){
            this.setState({value: nextProps.value});
        }
    }
    
    render (){
        return (
            <div className="controls">
                <div className="formGroup">
                    <label htmlFor="bg-color">Background color, hex</label>
                    <input type="text" className="form-control" name="bgColor" ref="bgColor" id="bg-color" placeholder="Background color" value={this.state.color} onChange={this.onChangeColor} />
                </div>
                <div className="formGroup">
                    <label htmlFor="thermo-height">Thermometr height, px</label>    
                    <input type="text" className="form-control" name="thermoHeight" id="thermo-height" ref="thermoHeight" placeholder="Height" value={this.state.height} onChange={this.onChangeHeight} />
                </div>
                <div className="formGroup">
                    <label htmlFor="thermo-value">Thermometr value, &deg;C</label>    
                    <input type="text" className="form-control" name="thermoValue" id="thermo-value" ref="thermoValue" placeholder="Themperature value" value={this.state.value} onChange={this.onChangeValue} />
                </div>
                <button className="btn btn-default" onClick={this.onClickSetValues}>Set values</button>
            </div>
        )
    }
}

class ForecastWidgetThermometr extends React.Component{
    
    constructor(props){
        super(props)
    }

    valueToPercent(value){
        const MAX_VALUE = 50
        const MIN_VALUE = -50
        
        return ((value - MIN_VALUE) * 100) / (MAX_VALUE - MIN_VALUE)
    }
    
    componentDidUpdate(){
        let heightVal = this.valueToPercent(this.props.value)
        $('.column').css('height', heightVal+'%')
    }
    
    render(){
        return (
            <div className="thermo">
                <div className="thermometr" style={{height: this.props.height+'px', 'backgroundColor': this.props.color}}>
                    <span className="thermometr-value"><span>{this.props.value}</span>&deg;C</span>
                    <div className="column"></div>
                    <div className="base"></div>
                </div>
            </div>
        )
    }
}

class ForecastWidget extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {color: '#aaa', value: 0, height: 300};
        this.onHandleonChangeValues = this.onHandleonChangeValues.bind(this)
    }
    
    componentDidMount(){
        let self = this
        $.get(
            'http://dataservice.accuweather.com/currentconditions/v1/1-324505_1_AL',
            {apikey: 'A7eAEd7dOqt7AuyWdGn3uWBCQnQ8z6Nj'},
            function(response){
                let temperature = response[0].Temperature.Metric.Value;
                self.setState({value: parseInt(temperature)})
            }
        )
    }
    
    onHandleonChangeValues(data){
        this.setState({
            color: data.bgColor,
            value: data.thermoValue,
            height: data.thermoHeight
        })
    }

    render(){
        return (
            <div className="forecast-widget">
                <ForecastWidgetThermometr value={this.state.value} color={this.state.color} height={this.state.height} />
                <ForecastWidgetControls value={this.state.value} color={this.state.color} height={this.state.height} onChangeValues={this.onHandleonChangeValues} />
            </div>
        )
    }
}

ReactDOM.render(
    <ForecastWidget />,
    document.getElementById('root')
);