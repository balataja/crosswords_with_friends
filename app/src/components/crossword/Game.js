import React, { Component } from 'react';
import Crossword from './src/javascripts/crosswords/crossword';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            gameData:
            {"id":"1/1/1976","name":"1/1/1976","date":"0001-01-01T00:00:00","entries":[{"id":"1-across","group":["1-across"],"separatorLocations":{},"number":1,"humanNumber":"1","clue":"1. Attention getter","direction":"across","length":4,"position":{"x":0,"y":0},"solution":"AHEM"},{"id":"5-across","group":["5-across"],"separatorLocations":{},"number":5,"humanNumber":"5","clue":"5. Zola title","direction":"across","length":4,"position":{"x":5,"y":0},"solution":"NANA"},{"id":"9-across","group":["9-across"],"separatorLocations":{},"number":9,"humanNumber":"9","clue":"9. Garlic unit","direction":"across","length":5,"position":{"x":10,"y":0},"solution":"CLOVE"},{"id":"14-across","group":["14-across"],"separatorLocations":{},"number":14,"humanNumber":"14","clue":"14. Met V.I.P.","direction":"across","length":4,"position":{"x":0,"y":1},"solution":"DIVA"},{"id":"15-across","group":["15-across"],"separatorLocations":{},"number":15,"humanNumber":"15","clue":"15. Is obligated","direction":"across","length":4,"position":{"x":5,"y":1},"solution":"OWES"},{"id":"16-across","group":["16-across"],"separatorLocations":{},"number":16,"humanNumber":"16","clue":"16. Volcanic outputs","direction":"across","length":5,"position":{"x":10,"y":1},"solution":"LAVAS"},{"id":"17-across","group":["17-across"],"separatorLocations":{},"number":17,"humanNumber":"17","clue":"17. Hymn word","direction":"across","length":4,"position":{"x":0,"y":2},"solution":"AMEN"},{"id":"18-across","group":["18-across"],"separatorLocations":{},"number":18,"humanNumber":"18","clue":"18. Nail specialist","direction":"across","length":10,"position":{"x":5,"y":2},"solution":"MANICURIST"},{"id":"20-across","group":["20-across"],"separatorLocations":{},"number":20,"humanNumber":"20","clue":"20. May apple","direction":"across","length":8,"position":{"x":0,"y":3},"solution":"MANDRAKE"},{"id":"22-across","group":["22-across"],"separatorLocations":{},"number":22,"humanNumber":"22","clue":"22. Tolerate","direction":"across","length":5,"position":{"x":9,"y":3},"solution":"ABIDE"},{"id":"23-across","group":["23-across"],"separatorLocations":{},"number":23,"humanNumber":"23","clue":"23. Staff man","direction":"across","length":4,"position":{"x":3,"y":4},"solution":"AIDE"},{"id":"24-across","group":["24-across"],"separatorLocations":{},"number":24,"humanNumber":"24","clue":"24. Terza ___","direction":"across","length":4,"position":{"x":8,"y":4},"solution":"RIMA"},{"id":"25-across","group":["25-across"],"separatorLocations":{},"number":25,"humanNumber":"25","clue":"25. Bowling scores","direction":"across","length":6,"position":{"x":0,"y":5},"solution":"SPARES"},{"id":"28-across","group":["28-across"],"separatorLocations":{},"number":28,"humanNumber":"28","clue":"28. Aquatic mammals","direction":"across","length":8,"position":{"x":7,"y":5},"solution":"MANATEES"},{"id":"32-across","group":["32-across"],"separatorLocations":{},"number":32,"humanNumber":"32","clue":"32. Red dye","direction":"across","length":5,"position":{"x":0,"y":6},"solution":"EOSIN"},{"id":"33-across","group":["33-across"],"separatorLocations":{},"number":33,"humanNumber":"33","clue":"33. Baker's ___","direction":"across","length":5,"position":{"x":6,"y":6},"solution":"DOZEN"},{"id":"34-across","group":["34-across"],"separatorLocations":{},"number":34,"humanNumber":"34","clue":"34. Geographical abbr.","direction":"across","length":3,"position":{"x":12,"y":6},"solution":"LAT"},{"id":"35-across","group":["35-across"],"separatorLocations":{},"number":35,"humanNumber":"35","clue":"35. Org.","direction":"across","length":4,"position":{"x":0,"y":7},"solution":"ASSN"},{"id":"36-across","group":["36-across"],"separatorLocations":{},"number":36,"humanNumber":"36","clue":"36. Tender spots","direction":"across","length":5,"position":{"x":5,"y":7},"solution":"SORES"},{"id":"37-across","group":["37-across"],"separatorLocations":{},"number":37,"humanNumber":"37","clue":"37. Venetian ruler","direction":"across","length":4,"position":{"x":11,"y":7},"solution":"DOGE"},{"id":"38-across","group":["38-across"],"separatorLocations":{},"number":38,"humanNumber":"38","clue":"38. Draw","direction":"across","length":3,"position":{"x":0,"y":8},"solution":"TIE"},{"id":"39-across","group":["39-across"],"separatorLocations":{},"number":39,"humanNumber":"39","clue":"39. Something, in Germany","direction":"across","length":5,"position":{"x":4,"y":8},"solution":"ETWAS"},{"id":"40-across","group":["40-across"],"separatorLocations":{},"number":40,"humanNumber":"40","clue":"40. Turn back","direction":"across","length":5,"position":{"x":10,"y":8},"solution":"REPEL"},{"id":"41-across","group":["41-across"],"separatorLocations":{},"number":41,"humanNumber":"41","clue":"41. Footstools","direction":"across","length":8,"position":{"x":0,"y":9},"solution":"OTTOMANS"},{"id":"43-across","group":["43-across"],"separatorLocations":{},"number":43,"humanNumber":"43","clue":"43. \"I am a ___\"","direction":"across","length":6,"position":{"x":9,"y":9},"solution":"CAMERA"},{"id":"44-across","group":["44-across"],"separatorLocations":{},"number":44,"humanNumber":"44","clue":"44. Chimneys, in Glasgow","direction":"across","length":4,"position":{"x":3,"y":10},"solution":"LUMS"},{"id":"45-across","group":["45-across"],"separatorLocations":{},"number":45,"humanNumber":"45","clue":"45. Teasdale","direction":"across","length":4,"position":{"x":8,"y":10},"solution":"SARA"},{"id":"46-across","group":["46-across"],"separatorLocations":{},"number":46,"humanNumber":"46","clue":"46. Soup server","direction":"across","length":5,"position":{"x":1,"y":11},"solution":"LADLE"},{"id":"48-across","group":["48-across"],"separatorLocations":{},"number":48,"humanNumber":"48","clue":"48. Fictional villain","direction":"across","length":8,"position":{"x":7,"y":11},"solution":"FUMANCHU"},{"id":"52-across","group":["52-across"],"separatorLocations":{},"number":52,"humanNumber":"52","clue":"52. Pawed","direction":"across","length":10,"position":{"x":0,"y":12},"solution":"MANHANDLED"},{"id":"54-across","group":["54-across"],"separatorLocations":{},"number":54,"humanNumber":"54","clue":"54. Sullen","direction":"across","length":4,"position":{"x":11,"y":12},"solution":"DOUR"},{"id":"55-across","group":["55-across"],"separatorLocations":{},"number":55,"humanNumber":"55","clue":"55. Old English coin","direction":"across","length":5,"position":{"x":0,"y":13},"solution":"GROAT"},{"id":"56-across","group":["56-across"],"separatorLocations":{},"number":56,"humanNumber":"56","clue":"56. Florida county","direction":"across","length":4,"position":{"x":6,"y":13},"solution":"DADE"},{"id":"57-across","group":["57-across"],"separatorLocations":{},"number":57,"humanNumber":"57","clue":"57. Fitzgerald","direction":"across","length":4,"position":{"x":11,"y":13},"solution":"ELLA"},{"id":"58-across","group":["58-across"],"separatorLocations":{},"number":58,"humanNumber":"58","clue":"58. French relative","direction":"across","length":5,"position":{"x":0,"y":14},"solution":"TANTE"},{"id":"59-across","group":["59-across"],"separatorLocations":{},"number":59,"humanNumber":"59","clue":"59. Machine gun","direction":"across","length":4,"position":{"x":6,"y":14},"solution":"STEN"},{"id":"60-across","group":["60-across"],"separatorLocations":{},"number":60,"humanNumber":"60","clue":"60. Start a card game","direction":"across","length":4,"position":{"x":11,"y":14},"solution":"DEAL"},{"id":"1-down","group":["1-down"],"separatorLocations":{},"number":1,"humanNumber":"1","clue":"1. Bede","direction":"down","length":4,"position":{"x":0,"y":0},"solution":"ADAM"},{"id":"2-down","group":["2-down"],"separatorLocations":{},"number":2,"humanNumber":"2","clue":"2. Uganda people","direction":"down","length":4,"position":{"x":1,"y":0},"solution":"HIMA"},{"id":"3-down","group":["3-down"],"separatorLocations":{},"number":3,"humanNumber":"3","clue":"3. Smooth","direction":"down","length":4,"position":{"x":2,"y":0},"solution":"EVEN"},{"id":"4-down","group":["4-down"],"separatorLocations":{},"number":4,"humanNumber":"4","clue":"4. Orange","direction":"down","length":8,"position":{"x":3,"y":0},"solution":"MANDARIN"},{"id":"5-down","group":["5-down"],"separatorLocations":{},"number":5,"humanNumber":"5","clue":"5. Restless ones","direction":"down","length":6,"position":{"x":5,"y":0},"solution":"NOMADS"},{"id":"6-down","group":["6-down"],"separatorLocations":{},"number":6,"humanNumber":"6","clue":"6. On one's toes","direction":"down","length":5,"position":{"x":6,"y":0},"solution":"AWAKE"},{"id":"7-down","group":["7-down"],"separatorLocations":{},"number":7,"humanNumber":"7","clue":"7. Hawaiian goose","direction":"down","length":4,"position":{"x":7,"y":0},"solution":"NENE"},{"id":"8-down","group":["8-down"],"separatorLocations":{},"number":8,"humanNumber":"8","clue":"8. \"___ was saying . . . \"","direction":"down","length":3,"position":{"x":8,"y":0},"solution":"ASI"},{"id":"9-down","group":["9-down"],"separatorLocations":{},"number":9,"humanNumber":"9","clue":"9. Elk or Rotarian","direction":"down","length":7,"position":{"x":10,"y":0},"solution":"CLUBMAN"},{"id":"10-down","group":["10-down"],"separatorLocations":{},"number":10,"humanNumber":"10","clue":"10. Lasso","direction":"down","length":6,"position":{"x":11,"y":0},"solution":"LARIAT"},{"id":"11-down","group":["11-down"],"separatorLocations":{},"number":11,"humanNumber":"11","clue":"11. Roman poet","direction":"down","length":4,"position":{"x":12,"y":0},"solution":"OVID"},{"id":"12-down","group":["12-down"],"separatorLocations":{},"number":12,"humanNumber":"12","clue":"12. Flower holder","direction":"down","length":4,"position":{"x":13,"y":0},"solution":"VASE"},{"id":"13-down","group":["13-down"],"separatorLocations":{},"number":13,"humanNumber":"13","clue":"13. Superlative ending","direction":"down","length":3,"position":{"x":14,"y":0},"solution":"EST"},{"id":"19-down","group":["19-down"],"separatorLocations":{},"number":19,"humanNumber":"19","clue":"19. Actor Michael and family","direction":"down","length":6,"position":{"x":9,"y":2},"solution":"CAINES"},{"id":"21-down","group":["21-down"],"separatorLocations":{},"number":21,"humanNumber":"21","clue":"21. Nothing, in Paris","direction":"down","length":4,"position":{"x":4,"y":3},"solution":"RIEN"},{"id":"24-down","group":["24-down"],"separatorLocations":{},"number":24,"humanNumber":"24","clue":"24. Destroys","direction":"down","length":5,"position":{"x":8,"y":4},"solution":"RAZES"},{"id":"25-down","group":["25-down"],"separatorLocations":{},"number":25,"humanNumber":"25","clue":"25. Treaty org.","direction":"down","length":5,"position":{"x":0,"y":5},"solution":"SEATO"},{"id":"26-down","group":["26-down"],"separatorLocations":{},"number":26,"humanNumber":"26","clue":"26. Assume","direction":"down","length":5,"position":{"x":1,"y":5},"solution":"POSIT"},{"id":"27-down","group":["27-down"],"separatorLocations":{},"number":27,"humanNumber":"27","clue":"27. Black-ink item","direction":"down","length":5,"position":{"x":2,"y":5},"solution":"ASSET"},{"id":"28-down","group":["28-down"],"separatorLocations":{},"number":28,"humanNumber":"28","clue":"28. S.A. trees","direction":"down","length":5,"position":{"x":7,"y":5},"solution":"MORAS"},{"id":"29-down","group":["29-down"],"separatorLocations":{},"number":29,"humanNumber":"29","clue":"29. Run off","direction":"down","length":5,"position":{"x":12,"y":5},"solution":"ELOPE"},{"id":"30-down","group":["30-down"],"separatorLocations":{},"number":30,"humanNumber":"30","clue":"30. Agog","direction":"down","length":5,"position":{"x":13,"y":5},"solution":"EAGER"},{"id":"31-down","group":["31-down"],"separatorLocations":{},"number":31,"humanNumber":"31","clue":"31. Stone slab","direction":"down","length":5,"position":{"x":14,"y":5},"solution":"STELA"},{"id":"33-down","group":["33-down"],"separatorLocations":{},"number":33,"humanNumber":"33","clue":"33. Football units","direction":"down","length":5,"position":{"x":6,"y":6},"solution":"DOWNS"},{"id":"36-down","group":["36-down"],"separatorLocations":{},"number":36,"humanNumber":"36","clue":"36. Flower part","direction":"down","length":6,"position":{"x":5,"y":7},"solution":"STAMEN"},{"id":"37-down","group":["37-down"],"separatorLocations":{},"number":37,"humanNumber":"37","clue":"37. Called for","direction":"down","length":8,"position":{"x":11,"y":7},"solution":"DEMANDED"},{"id":"39-down","group":["39-down"],"separatorLocations":{},"number":39,"humanNumber":"39","clue":"39. Rival","direction":"down","length":7,"position":{"x":4,"y":8},"solution":"EMULATE"},{"id":"40-down","group":["40-down"],"separatorLocations":{},"number":40,"humanNumber":"40","clue":"40. ___ avis","direction":"down","length":4,"position":{"x":10,"y":8},"solution":"RARA"},{"id":"42-down","group":["42-down"],"separatorLocations":{},"number":42,"humanNumber":"42","clue":"42. Passé","direction":"down","length":6,"position":{"x":3,"y":9},"solution":"OLDHAT"},{"id":"43-down","group":["43-down"],"separatorLocations":{},"number":43,"humanNumber":"43","clue":"43. N.J. city","direction":"down","length":6,"position":{"x":9,"y":9},"solution":"CAMDEN"},{"id":"45-down","group":["45-down"],"separatorLocations":{},"number":45,"humanNumber":"45","clue":"45. Shoe material","direction":"down","length":5,"position":{"x":8,"y":10},"solution":"SUEDE"},{"id":"46-down","group":["46-down"],"separatorLocations":{},"number":46,"humanNumber":"46","clue":"46. Pasternak heroine","direction":"down","length":4,"position":{"x":1,"y":11},"solution":"LARA"},{"id":"47-down","group":["47-down"],"separatorLocations":{},"number":47,"humanNumber":"47","clue":"47. Soon","direction":"down","length":4,"position":{"x":2,"y":11},"solution":"ANON"},{"id":"48-down","group":["48-down"],"separatorLocations":{},"number":48,"humanNumber":"48","clue":"48. Stale","direction":"down","length":4,"position":{"x":7,"y":11},"solution":"FLAT"},{"id":"49-down","group":["49-down"],"separatorLocations":{},"number":49,"humanNumber":"49","clue":"49. Porter","direction":"down","length":4,"position":{"x":12,"y":11},"solution":"COLE"},{"id":"50-down","group":["50-down"],"separatorLocations":{},"number":50,"humanNumber":"50","clue":"50. Oahu dance","direction":"down","length":4,"position":{"x":13,"y":11},"solution":"HULA"},{"id":"51-down","group":["51-down"],"separatorLocations":{},"number":51,"humanNumber":"51","clue":"51. Russian range","direction":"down","length":4,"position":{"x":14,"y":11},"solution":"URAL"},{"id":"52-down","group":["52-down"],"separatorLocations":{},"number":52,"humanNumber":"52","clue":"52. Labor's counterpart: Abbr.","direction":"down","length":3,"position":{"x":0,"y":12},"solution":"MGT"},{"id":"53-down","group":["53-down"],"separatorLocations":{},"number":53,"humanNumber":"53","clue":"53. Dental degree","direction":"down","length":3,"position":{"x":6,"y":12},"solution":"DDS"}],"dimensions":{cols:15,rows:15},crosswordType: 'genius',},

            data2:
                {
                  id: 'simple/1',
                  number: 1,
                  name: 'Simple Crossword 1',
                  date: 1542326400000,
                  entries: [
                    {
                      id: '1-across',
                      number: 1,
                      humanNumber: '1',
                      clue: 'Toy on a string (2-2)',
                      direction: 'across',
                      length: 4,
                      group: ['1-across'],
                      position: { x: 0, y: 0 },
                      separatorLocations: {
                        '-': [2],
                      },
                      solution: 'YOYO',
                    },
                    {
                      id: '2-across',
                      number: 2,
                      humanNumber: '2',
                      clue: 'Have a rest (3,4)',
                      direction: 'across',
                      length: 7,
                      group: ['2-across'],
                      position: { x: 0, y: 2 },
                      separatorLocations: {
                        ',': [3],
                      },
                      solution: 'LIEDOWN',
                    },
                    {
                      id: '1-down',
                      number: 1,
                      humanNumber: '1',
                      clue: 'Colour (6)',
                      direction: 'down',
                      length: 6,
                      group: ['1-down'],
                      position: { x: 0, y: 0 },
                      separatorLocations: {},
                      solution: 'YELLOW',
                    },
                    {
                      id: '3-down',
                      number: 3,
                      humanNumber: '3',
                      clue: 'Bits and bobs (4,3,4)',
                      direction: 'down',
                      length: 7,
                      group: ['3-down', '4-down'],
                      position: { x: 3, y: 0 },
                      separatorLocations: {
                        ',': [4],
                      },
                      solution: 'ODDSAND',
                    },
                    {
                      id: '4-down',
                      number: 4,
                      humanNumber: '4',
                      clue: 'See 3 down',
                      direction: 'down',
                      length: 4,
                      group: ['3-down', '4-down'],
                      position: {
                        x: 6,
                        y: 1,
                      },
                      separatorLocations: {},
                      solution: 'ENDS',
                    },
                  ],
                  solutionAvailable: true,
                  dateSolutionAvailable: 1542326400000,
                  dimensions: {
                    cols: 13,
                    rows: 13,
                  },
                  crosswordType: 'quick',
                }
            
        }
    }

    componentDidMount() {
        
    }
    
    render = () => {
        const userId = this.props.location.state.userId;
        const players = this.props.location.state.players;
        const playerNumber = players.filter(function (player) {
            return player.userId == userId;
        });
        return (
            <div>
                <Crossword 
                    //data={this.state.gameData}
                    //data={this.state.data2}
                    data={this.props.location.state.crossword}
                    gridId={this.props.location.state.gridId}
                    playerNumber={playerNumber[0].playerNumber}
                    gameId={this.props.location.state.gameId}
                />
            </div>
        )
    }
}

export default Game;