import React, { Component } from "react";
import PieChart from "react-minimal-pie-chart";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { connect } from "react-redux";
import { CircleProgress } from "react-gradient-progress";
import jwtDecode from "jwt-decode";
import cx from "classnames";
import CanvasJSReact from "./canvasjs.react"
import "./css/stadistics.css";

library.add(fas, fab);

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints =[];
let chartKey = Math.random()

class Stadistics extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    const token = localStorage.token;
    let decode = jwtDecode(token);
    const { id_cliente } = decode;
    var chart = this.chart;
    axios.post('http://177.71.157.129:4000/countFiltered', {id_cliente})
    .then(function(data) {
      console.log(data.data)
      let datos = data.data
      for (let i = 0; i < datos.length; i++) {
        let fecha = datos[i].fecha_venta.split('T')[0]
        let año = fecha.split('-')[0]
        let mes = fecha.split('-')[1]
        let dia = fecha.split('-')[2]
        console.log(fecha, año, mes, dia)
        dataPoints.push({
          x: new Date(fecha + "T00:00:00"), // sin eso me tiraria un mes adicional because reasons
          y: datos[i].total_venta
        });
      }
      chart.render();
      chartKey = Math.random()
    });
  }

  handleChange(e) {
    console.log(e);
    console.log(this.state.selectedOption);
    this.setState({selectedOption : {
      value: e.value
    }})
  }


  render() {

    const optionsLinear = {
      animationEnabled: true,
      animationDuration: 2000,
			theme: "light2",
			title: {
				text: "Graficos de ventas"
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
            key={chartKey}
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
