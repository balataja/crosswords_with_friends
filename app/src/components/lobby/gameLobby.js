import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Link, useHistory, withRouter } from 'react-router-dom';
import GenericForm from '../form-fields/generic-form';
import { getCrossword, getCrosswords } from '../../redux/modules/crossword';
import { getGridState, initializeGridState } from '../../redux/modules/gridState';
import { getGame, getGames, addGame, joinGame } from '../../redux/modules/game';
import { getUserGames } from '../../redux/modules/user';
import { errorPropTypes } from '../../util/proptype-utils';
import { RESET_PASSWORD } from '../../redux/modules/authentication';
import TextInput from '../form-fields/text-input';
import {
    buildClueMap,
    buildNewGrid,
    buildGrid,
  } from '../crossword/src/javascripts/crosswords/helpers';

const form = reduxForm({
    form: 'gameLobby',
});

class GameLobby extends Component {
    static propTypes = {
        getCrossword: PropTypes.func,
        getCrosswords: PropTypes.func,
        handleSubmit: PropTypes.func,
        errors: errorPropTypes,
        message: PropTypes.string,
        loading: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = { game: "game data here..",
            userGames: [{createdDate:
                "2020-01-20T21:51:31.281Z",
                gameId:
                "5e2620e3e20f155870d99e88",
                isActive:
                true
                }],
            allGames: [],
         };
        this.createGame = this.createGame.bind(this);
        this.continueGame = this.continueGame.bind(this);
        this.joinSpecificGame = this.joinSpecificGame.bind(this);
    }

    static formSpec = [
        { id: 'gameId', name: 'gameId', label: 'Join Game', type: 'joinGame', placeholder: 'game ID', component: TextInput },
    ];
      
    async componentDidMount() {
        var allGames = await this.props.getGames(this.props.location.state.user.id);
        var userGames = this.props.location.state.user.games;
        this.setState({
            userGames: userGames,
            allGames: allGames,
        });
    }

    async createGame (formProps) {
        var crosswordRes = await this.props.getCrosswords(formProps);
        const num = Math.floor(Math.random() * crosswordRes.length);
        this.setState({
            crossword: crosswordRes[num]
        });

        const dimensions = this.state.crossword.dimensions;
        this.columns = dimensions.cols;
        this.rows = dimensions.rows;
        this.clueMap = buildClueMap(this.state.crossword.entries);

        const gridState = buildNewGrid(
            dimensions.rows,
            dimensions.cols,
            this.state.crossword.entries
        );

        var grid = await this.props.initializeGridState(gridState);
        this.setState({
            gridStateId: grid._id
        })
        var game = {
            name: this.state.crossword.name,
            gridStateId: this.state.gridStateId,
            crosswordId: this.state.crossword._id,
            userId: this.props.location.state.user.id,
        }

        var gameRes = await this.props.addGame(game);
    }

    async continueGame (gameId) {
        var game = await this.props.getGame(gameId);
        var cross = await this.props.getCrossword(game.crosswordId);
        this.props.history.push(
            {
                pathname:'/game', 
                state: {
                    gridId: game.gridStateId, 
                    crossword: cross, 
                    players: game.players, 
                    userId: this.props.location.state.user.id,
                    gameId: gameId
                }
            }
        );
    }

    async joinGame (game) {
        const data = {
            gameId: game._id,
            userId: this.props.location.state.user.id,
        }
        var joinedGame = await this.props.joinGame(data);
        console.log('joining game..');
        console.log(joinedGame);
        await this.continueGame(game._id);
    }

    async joinSpecificGame (formProps) {
        console.log(formProps.gameId);
        var gameToJoin = await this.props.getGame(formProps.gameId);
        console.log(gameToJoin);
        if (gameToJoin === undefined) {
            return;
        } 

        const data = {
            gameId: formProps.gameId,
            userId: this.props.location.state.user.id,
        }
        await this.props.joinGame(data)

        await this.continueGame(formProps.gameId);

    }

    render ()  {
        const { handleSubmit, errors, message, loading } = this.props;
        return (
            <div>
                {this.state.userGames.map((game, i) => 
                    <div key={i}>
                        <GenericForm
                            onSubmit={handleSubmit(() => this.continueGame(game.gameId))}
                            errors={errors}
                            message={message}
                            //formSpec={GameLobby.formSpec}
                            submitText={game.name}
                        />
                        <p>Send the following ID to friend to join this game.</p>
                        <p>
                            Game ID: {game.gameId}
                        </p>
                    </div>
                )}
                <GenericForm
                    onSubmit={handleSubmit(this.createGame)}
                    errors={errors}
                    message={message}
                    //formSpec={GameLobby.formSpec}
                    submitText="Create New Random Game"
                />
                <br />
                {/* <p>
                    All other games that are joinable:
                </p>

                {this.state.allGames.map((game, i) => 
                    <div key={i}>
                        <p>Name: {game.createdDate}</p>
                        <p>Active: {game.isActive}</p>

                        <GenericForm key={i}
                            onSubmit={handleSubmit(() => this.joinGame(game))}
                            errors={errors}
                            message={message}
                            //formSpec={GameLobby.formSpec}
                            submitText="Join Game"
                        />
                        <br />
                    </div>
                )} */}

                <GenericForm
                    onSubmit={handleSubmit(this.joinSpecificGame)}
                    errors={errors}
                    message={message}
                    formSpec={GameLobby.formSpec}
                    submitText="Join Game"
                />
            </div>
        )
    }
}
  
const mapStateToProps = ({ authentication }) => ({
    errors: authentication.errors[RESET_PASSWORD],
    message: authentication.messages[RESET_PASSWORD],
    loading: authentication.loading[RESET_PASSWORD],
  });
  
  export default withRouter(connect(mapStateToProps, { getUserGames, getCrosswords, getCrossword, getGame, getGames, addGame, joinGame, getGridState, initializeGridState })(form(GameLobby)));