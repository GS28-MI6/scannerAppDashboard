import React, { Component } from "react";
import PieChart from "react-minimal-pie-chart";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { connect } from "react-redux";
import { CircleProgress } from "react-gradient-progress";
import cx from "classnames";
import CanvasJSReact from "./canvasjs.react"
import "./css/stadistics.css";

library.add(fas, fab);

const options = [
  { value: "Accidente Vial", label: "Accidente Vial"},
  { value: "Bomberos", label: "Bomberos"},
  { value: "Disturbios", label: "Distubios"},
  { value: "General", label: "General"},
  { value: "Robo", label: "Robo"},
  { value: "Salud", label: "Salud"},
  { value: "Violencia de Género", label: "Violencia de Género"}
];

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints =[];

class Stadistics extends Component {
  constructor(props) {
    super(props);
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.handleChange = this.handleChange.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    var chart = this.chart;
    axios.post('http://177.71.157.129:4000/countFiltered')
    .then(function(data) {
      console.log(data.data)
      var datos = data.data
      for (var i = 0; i < datos.length; i++) {
        var fecha = datos[i].fecha_venta.split('T')[0]
        var año = fecha.split('-')[0]
        var mes = fecha.split('-')[1]
        var dia = fecha.split('-')[2]
        console.log(fecha, año, mes, dia)
        dataPoints.push({
          x: new Date(fecha + "T00:00:00"), // sin eso me tiraria un mes adicional because reasons
          y: datos[i].total_venta
        });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  handleChange(e) {
    console.log(e);
    console.log(this.state.selectedOption);
    this.setState({selectedOption : {
      value: e.value
    }})
  }

  updateWindowDimensions() {
    var heightHolder = window.innerHeight - 50;
    this.stateheight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
  }
  

  render() {

    const optionsLinear = {
			theme: "light2",
			title: {
				text: "Graficos de categorias"
			},
			axisY: {
				title: "Cantidad",
				prefix: "",
				includeZero: false
      },
      axisX: {
				title: "Fecha",
				prefix: ""
			},
			data: [{
				type: "line",
				yValueFormatString: "#",
				dataPoints: dataPoints
      }]
    }



    const graphLinear = cx(
      'linear-Graph'
    )
      return (
        <div className={graphLinear}>
            <CanvasJSChart options = {optionsLinear} 
            onRef={ref => this.chart = ref}
            />
        </div>
      );
  }
}

const mapStateToProps = state => ({
  counts: state.posts.counts
});

export default connect(mapStateToProps, null)(Stadistics);
