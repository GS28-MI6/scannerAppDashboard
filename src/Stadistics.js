import React, { Component } from "react";
import PieChart from "react-minimal-pie-chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { connect } from "react-redux";
import { countAlerts } from "./actions/postActions";
import { countAlertsFiltered } from "./actions/postActions";
import { CircleProgress } from "react-gradient-progress";
import cx from "classnames";
import CreatableSelect from "react-select";
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
    this.props.countAlerts();
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.handleChange = this.handleChange.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      isHovered1: false,
      isHovered2: false,
      isHovered3: false,
      isHovered4: false,
      isHovered5: false,
      isHovered6: false,
      selectedOption: {
        value: "General"
      },
      currentGraph: "General"
    };
    this.toggleHover = this.toggleHover.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    this.props.countAlerts();
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

  submitForm() {
    var desde = document.getElementById("dateFrom").value
    var hasta = document.getElementById("dateTo").value
    var tipo = this.state.selectedOption.value

    if(tipo === "General"){
      this.props.countAlertsFiltered(desde, hasta)
      this.setState({currentGraph : tipo})
    }else{
      var chart = this.chart;
      this.setState({currentGraph : tipo})
      axios.post('http://18.230.143.84:4000/countFiltered', {tipo, desde, hasta})
      .then(function(data) {
        var datos = data.data
        for (var i = 0; i < datos.length; i++) {
          var fecha = datos[i].dia.split('T')[0]
          var año = fecha.split('-')[0]
          var mes = fecha.split('-')[1]
          var dia = fecha.split('-')[2]
          console.log(fecha, año, mes, dia)
          dataPoints.push({
            x: new Date(año, mes, dia),
            y: datos[i].tipo
          });
        }
        chart.render();
        console.log(dataPoints)
      });
    }
  }

  updateWindowDimensions() {
    var heightHolder = window.innerHeight - 50;
    this.stateheight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
  }
  toggleHover(graph) {
    switch(graph){
      case 1:
        this.setState(prevState => ({isHovered1: !prevState.isHovered1}));
        console.log(this.state.isHovered1)
        break;
      case 2:
        this.setState(prevState => ({isHovered2: !prevState.isHovered2}));
        console.log(this.state.isHovered2)
        break;
      case 3:
        this.setState(prevState => ({isHovered3: !prevState.isHovered3}));
        console.log(this.state.isHovered3)
        break;
      case 4:
        this.setState(prevState => ({isHovered4: !prevState.isHovered4}));
        console.log(this.state.isHovered4)
        break;
      case 5:
        this.setState(prevState => ({isHovered5: !prevState.isHovered5}));
        break;
      case 6:
        this.setState(prevState => ({isHovered6: !prevState.isHovered6}));
        break;
      default:
        break;
    }
  }

  render() {
    console.log(this.props.counts);
    const {
      total,
      accidente_vial,
      disturbios,
      bomberos,
      robo,
      salud,
      violencia_genero
    } = this.props.counts;
    var percentageAccidente = Math.round((accidente_vial * 100) / total);
    var labelAccindente = percentageAccidente + "%"
    var percentageBomberos = Math.round((bomberos * 100) / total);
    var labelBomberos = percentageBomberos + "%"
    var percentageDisturbios = Math.round((disturbios * 100) / total);
    var labelDistubios = percentageDisturbios + "%"
    var percentageRobo = Math.round((robo * 100) / total);
    var labelRobo = percentageRobo + "%"
    var percentageSalud = Math.round((salud * 100) / total);
    var labelSalud = percentageSalud + "%"
    var percentageViolencia = Math.round((violencia_genero * 100) / total);
    var labelViolencia = percentageViolencia + "%"

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
				xValueFormatString: "####",
				yValueFormatString: "#",
				dataPoints: dataPoints
      }]
    }

    const graphGeneral = cx({
      'graph-container' : this.state.currentGraph === "General",
      'hide' : this.state.currentGraph !== "General"
    })

    const graphLinear = cx({
      'linear-Graph' : this.state.currentGraph !== "General",
      'hide' : this.state.currentGraph === "General"
    })

    if (this.props.counts.bomberos !== undefined) {
      return (
        <div
          className="div-container"
          style={{ height: this.stateHeight.heightHolder }}
        >
          <div
            className={graphGeneral}
            style={{ height: this.stateHeight.heightHolder - 50 }}
          >
            <div className="general-info">
              <h1>Alertas totales recibidas</h1>
              <h1>{total}</h1>
              <div className="graph-data">
                <div className="leyenda">
                  <div className="item-leyenda">
                    <div
                      style={{
                        display: "block",
                        width: "15px",
                        height: "15px",
                        background: "#E38627",
                        borderRadius: "2px",
                        marginRight: "5px"
                      }}
                    >
                      {" "}
                    </div>
                    <p>Accidente Vial</p>
                  </div>
                  <div className="item-leyenda">
                    <div
                      style={{
                        display: "block",
                        width: "15px",
                        height: "15px",
                        background: "#ff0000",
                        borderRadius: "2px",
                        marginRight: "5px"
                      }}
                    >
                      {" "}
                    </div>
                    <p>Bomberos</p>
                  </div>
                  <div className="item-leyenda">
                    <div
                      style={{
                        display: "block",
                        width: "15px",
                        height: "15px",
                        background: "#468114",
                        borderRadius: "2px",
                        marginRight: "5px"
                      }}
                    >
                      {" "}
                    </div>
                    <p>Disturbios</p>
                  </div>
                  <div className="item-leyenda">
                    <div
                      style={{
                        display: "block",
                        width: "15px",
                        height: "15px",
                        background: "#0000FF",
                        borderRadius: "2px",
                        marginRight: "5px"
                      }}
                    >
                      {" "}
                    </div>
                    <p>Robo</p>
                  </div>
                  <div className="item-leyenda">
                    <div
                      style={{
                        display: "block",
                        width: "15px",
                        height: "15px",
                        background: "#6A2135",
                        borderRadius: "2px",
                        marginRight: "5px"
                      }}
                    >
                      {" "}
                    </div>
                    <p>Salud</p>
                  </div>
                  <div className="item-leyenda">
                    <div
                      style={{
                        display: "block",
                        width: "15px",
                        height: "15px",
                        background: "#F13CF7",
                        borderRadius: "2px",
                        marginRight: "5px"
                      }}
                    >
                      {" "}
                    </div>
                    <p>Violencia de Género</p>
                  </div>
                </div>
                <div className="piechart">
                  <PieChart
                    lineWidth={30}
                    radius={50}
                    data={[
                      {
                        title: "Accidente Vial",
                        value: accidente_vial,
                        color: "#E38627"
                      },
                      { title: "Bomberos",
                        value: bomberos,
                        color: "#FF0000"
                      },
                      {
                        title: "Distubios",
                        value: disturbios,
                        color: "#468114"
                      },
                      { title: "Robo",
                        value: robo,
                        color: "#0000FF"
                      },
                      { title: "Salud",
                        value: salud,
                        color: "#6A2135"
                      },
                      {
                        title: "Violencia de Género",
                        value: violencia_genero,
                        color: "#F13CF7"
                      }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="card-container">
              <h1 style={{ marginBottom: "4.5%" }}>Categorías de alertas</h1>
              <div className="card-alerts">
                <div className="alertbar" onMouseEnter={() => this.toggleHover(1)} onMouseLeave={() => this.toggleHover(1)}>
                  <p>Violencia de Género</p>
                  {this.state.isHovered1 ?
                    <CircleProgress
                    percentage={percentageViolencia}
                    label={violencia_genero}
                    strokeWidth={15}
                  /> :
                    <CircleProgress
                    percentage={percentageViolencia}
                    label={labelViolencia}
                    strokeWidth={15}
                    />
                  }
                </div>
                <div className="alertbar" onMouseEnter={() => this.toggleHover(2)} onMouseLeave={() => this.toggleHover(2)}>
                  <p>Disturbios</p>
                  {this.state.isHovered2 ?
                    <CircleProgress
                    percentage={percentageDisturbios}
                    label={disturbios}
                    strokeWidth={15}
                  /> :
                    <CircleProgress
                    percentage={percentageDisturbios}
                    label={labelDistubios}
                    strokeWidth={15}
                    />
                  }
                </div>
                <div className="alertbar" onMouseEnter={() => this.toggleHover(3)} onMouseLeave={() => this.toggleHover(3)}>
                  <p>Robo</p>
                  {this.state.isHovered3 ?
                    <CircleProgress
                    percentage={percentageRobo}
                    label={robo}
                    strokeWidth={15}
                  /> :
                    <CircleProgress
                    percentage={percentageRobo}
                    label={labelRobo}
                    strokeWidth={15}
                    />
                  }
                </div>
              </div>
              <div className="card-alerts">
                <div className="alertbar" onMouseEnter={() => this.toggleHover(4)} onMouseLeave={() => this.toggleHover(4)}>
                  <p>Bomberos</p>
                  {this.state.isHovered4 ?
                    <CircleProgress
                    percentage={percentageBomberos}
                    label={bomberos}
                    strokeWidth={15}
                  /> :
                    <CircleProgress
                    percentage={percentageBomberos}
                    label={labelBomberos}
                    strokeWidth={15}
                    />
                  }
                </div>
                <div className="alertbar" onMouseEnter={() => this.toggleHover(5)} onMouseLeave={() => this.toggleHover(5)}>
                  <p>Salud</p>
                  {this.state.isHovered5 ?
                    <CircleProgress
                    percentage={percentageSalud}
                    label={salud}
                    strokeWidth={15}
                  /> :
                    <CircleProgress
                    percentage={percentageSalud}
                    label={labelSalud}
                    strokeWidth={15}
                    />
                  }
                </div>
                <div className="alertbar" onMouseEnter={() => this.toggleHover(6)} onMouseLeave={() => this.toggleHover(6)}>
                  <p>Accidente Vial</p>
                  {this.state.isHovered6 ?
                    <CircleProgress
                    percentage={percentageAccidente}
                    label={accidente_vial}
                    strokeWidth={15}
                  /> :
                    <CircleProgress
                    percentage={percentageAccidente}
                    label={labelAccindente}
                    strokeWidth={15}
                    />
                  }
                </div>
              </div>
            </div>
            <div className="AlertContainer">
              <div className="alertCard"></div>
            </div>
          </div>
          <div className={graphLinear}>
            <CanvasJSChart options = {optionsLinear} 
            onRef={ref => this.chart = ref}
            />
          </div>
          <div className="formContainer">
            <h2 className="tituloFiltros">Gráficos con filtros</h2>
            <div className="row">
              <div className="dateFilter">
                <h2 className="dateTitle">Seleccione una fecha</h2>
                <div className="dates">
                  <div className="date">
                    <h2>Desde:</h2>
                    <input type="date" className=" css-yk16xz-control" id="dateFrom"></input>
                  </div>
                  <div className="date">
                    <h2>Hasta:</h2>
                    <input type="date" className=" css-yk16xz-control" id="dateTo"></input>
                  </div>
                </div>
                <h2 className="catTitle">Seleccione una categoria</h2>
                <CreatableSelect
                value={this.state.selectedOption.value}
                placeholder= {this.state.selectedOption.value}
                onChange={e => this.handleChange(e)}
                options={options}
                />
                <button type="button" onClick={() => this.submitForm()} className="submitDireccion"> Filtrar </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <p>Graficos de alertas</p>;
    }
  }
}

const mapStateToProps = state => ({
  counts: state.posts.counts
});

export default connect(mapStateToProps, { countAlerts, countAlertsFiltered})(Stadistics);
