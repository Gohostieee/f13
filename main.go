package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
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

type response struct {
	DataType string `json:"Request"`
	MapData  string `json:"mapData"`
}

type player struct {
	userConn *websocket.Conn
}
type playerConnArr struct {
	userCount uint16
	userArr   []player
}

func (self *playerConnArr) init() {
	self.userCount = 0

}
func (self *playerConnArr) addItem(user player) {
	self.userCount += 1
	self.userArr = append(self.userArr, user)
}
func (self playerConnArr) remove(i uint16) []player {
	self.userArr[i] = self.userArr[len(self.userArr)-1]
	return self.userArr[:len(self.userArr)-1]
}

var (
	playerConnections playerConnArr
)

var yumaMap mapgrid

var upgrader = websocket.Upgrader{} // use default options

func socketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade our raw HTTP connection to a websocket based one
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Error during connection upgradation:", err)
		return
	}
	defer conn.Close()
	// The event loop
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error during message reading:", err)
			break
		}
		switch string(message) {
		case "getMap":
			err = conn.WriteMessage(messageType, []byte(yumaMap.parseMap(32, 32, 32, 32)))

			break
		case "connect":
			var user player = player{conn}
			playerConnections.addItem(user)
			fmt.Printf("user count: %d", playerConnections.userCount)
			break
		default:
			conn.WriteMessage(messageType, []byte("what?"))

			break
		}
		if err != nil {
			log.Println("Error during message writing:", err)
			break
		}
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Error during connection upgradation:", err)
		return
	}
	defer conn.Close()

}
func sendMapData() {
	count := playerConnections.userCount

	for {
		res := response{"mapData", yumaMap.parseMap(32, 32, 32, 32)}
		for count = 0; count < playerConnections.userCount; count++ {
			fmt.Printf("%s", res.DataType)
			err := playerConnections.userArr[count].userConn.WriteJSON(res)
			if err != nil {
				fmt.Println("In another episode of how fucked up is fucked up: This is fucked up", err)
				playerConnections.userArr = playerConnections.remove(count)
				playerConnections.userCount--
				count--
			}
		}
		time.Sleep(100)
	}

}
func main() {
	playerConnections.init()
	yumaMap = yumaMap.createMap(320, 320)
	http.HandleFunc("/socket", socketHandler)
	http.HandleFunc("/", home)
	go sendMapData()
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
