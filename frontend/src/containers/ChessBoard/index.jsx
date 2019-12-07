import React, { Component } from "react"
import Chess from "chess.js"
import Chessboard from "chessboardjsx"

class ChessBoard extends Component {
  state = {
    fen: "start",
    dropSquareStyle: {},
    squareStyles: {},
    pieceSquare: "",
    square: "",
    history: []
  }

  game = new Chess()

  componentDidMount() {
    this.onDrop = this.onDrop.bind(this)
    this.onMouseOverSquare = this.onMouseOverSquare.bind(this)
    this.onMouseOutSquare = this.onMouseOutSquare.bind(this)
    this.onDragOverSquare = this.onDragOverSquare.bind(this)
    this.onSquareClick = this.onSquareClick.bind(this)
    this.onSquareRightClick= this.onSquareRightClick.bind(this)
  }

  removeHighlightSquare = () => {
    this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history })
    }))
  }

  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...squareStyling({
            history: this.state.history,
            pieceSquare: this.state.pieceSquare
          })
        };
      },
      {}
    )

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles }
    }))
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    }))
  }

  onMouseOverSquare = square => {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to)
    }

    this.highlightSquare(square, squaresToHighlight)
  }

  onMouseOutSquare = square => this.removeHighlightSquare(square)

  // central squares get diff dropSquareStyles
  onDragOverSquare = square => {
    this.setState({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    })
  }

  onSquareClick = square => {
    this.setState(({ history }) => ({
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square
    }));

    let move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      pieceSquare: ""
    })
  }

  onSquareRightClick = square => {
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } }
    })
  }

  render() {
    const { fen, dropSquareStyle, squareStyles } = this.state
    const { orientation } = this.props

    return (
      <Chessboard
        width={320}
        position={fen}
        onDrop={this.onDrop}
        orientation={orientation}
        onMouseOverSquare={this.onMouseOverSquare}
        onMouseOutSquare={this.onMouseOutSquare}
        boardStyle={{
          borderRadius: "5px",
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
        }}
        squareStyles={squareStyles}
        dropSquareStyle={dropSquareStyle}
        onDragOverSquare={this.onDragOverSquare}
        onSquareClick={this.onSquareClick}
        onSquareRightClick={this.onSquareRightClick}
      />
    )
  }
}

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  }
}

export default ChessBoard
