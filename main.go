// client.go
package main

import (
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

type mapcell struct {
	tile uint16
	y    uint16
	x    uint16
}
type mapgrid struct {
	mapArr []mapcell
	sizeX  uint16
	sizeY  uint16
}
type response struct {
	Request string
	param   string
}

var yumaMap mapgrid
var done chan interface{}
var interrupt chan os.Signal
var count int64 = 0

func receiveHandler(connection *websocket.Conn) {
	var res response
	defer close(done)
	for {

		err := connection.ReadJSON(&res)
		if err != nil {
			log.Println("Error in receive:", err)
		}
		log.Printf("Received: something! %s", res)
		switch res.Request {
		case "mapData":
			log.Print("wo")
			break
		}
	}
}

func main() {

	done = make(chan interface{})    // Channel to indicate that the receiverHandler is done
	interrupt = make(chan os.Signal) // Channel to listen for interrupt signal to terminate gracefully

	signal.Notify(interrupt, os.Interrupt) // Notify the interrupt channel for SIGINT

	socketUrl := "ws://localhost:8080" + "/socket"
	conn, _, err := websocket.DefaultDialer.Dial(socketUrl, nil)
	if err != nil {
		log.Fatal("Error connecting to Websocket Server:", err)
	}
	conn.WriteMessage(websocket.TextMessage, []byte("connect"))
	go receiveHandler(conn)
	// Our main loop for the client
	// We send our relevant packets here
	for {
		select {
		/*
			case <-time.After(time.Millisecond * 100):
				// Send an echo packet every second (or some other time measurement based out of a millisecond)

				err := conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("getap")))
				if err != nil {
					log.Println("Error during writing to websocket:", err)
					return
				}
		*/
		case <-interrupt:
			// We received a SIGINT (Ctrl + C). Terminate gracefully...
			log.Println("Received SIGINT interrupt signal. Closing all pending connections")

			// Close our websocket connection
			err := conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("Error during closing websocket:", err)
				return
			}

			select {
			case <-done:
				log.Println("Receiver Channel Closed! Exiting....")
			case <-time.After(time.Duration(100) * time.Second):
				log.Println("Timeout in closing receiving channel. Exiting....")
			}
			return
		}
	}

}
