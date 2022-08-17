package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

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

var (
	users [3]*websocket.Conn
)

func (self mapgrid) createMap(x uint16, y uint16) mapgrid {
	self.sizeX = x
	self.sizeY = y
	var (
		count1 uint16
		count2 uint16
		index  uint16 = 0
	)
	fmt.Printf("%d %d %d", x*y, x, y)
	self.mapArr = (make([]mapcell, int64(x)*int64(y)))
	for count1 = 0; count1 < x-1; count1++ {
		for count2 = 0; count2 < y-1; count2++ {
			self.mapArr[index].tile = 0
			self.mapArr[index].x = count1
			self.mapArr[index].y = count2
			index++
		}
	}
	return self
}

func (self mapgrid) parseMap(xPos uint16, yPos uint16, xRange uint16, yRange uint16) string {
	var mapjson strings.Builder
	mapjson.WriteString("{mapArr=[")
	var count1 uint32

	for count1 = 0; count1 < uint32(self.sizeX)*uint32(self.sizeY); count1++ {

		mapjson.WriteString(fmt.Sprintf("{tile:'%d'}", self.mapArr[count1].tile))

	}
	return mapjson.String()
}

var yumaMap mapgrid

var upgrader = websocket.Upgrader{} // use default options

func socketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade our raw HTTP connection to a websocket based one
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Error during connection upgradation:", err)
		return
	}

	// The event loop
	for {
		messageType, message, err := conn.ReadMessage()
		var _ = message
		if err != nil {
			log.Println("Error during message reading:", err)
			break
		}
		err = conn.WriteMessage(messageType, []byte(yumaMap.parseMap(32, 32, 32, 32)))
		if err != nil {
			log.Println("Error during message writing:", err)
			break
		}
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Index Page")
}

func main() {
	yumaMap = yumaMap.createMap(320, 320)
	http.HandleFunc("/socket", socketHandler)
	http.HandleFunc("/", home)
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
