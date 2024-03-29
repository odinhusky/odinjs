import { useState } from 'react'
import { StyleSheet, FlatList, Image, Platform, Pressable } from 'react-native'

export default function EmojiList({ onSelect, onClose }) {
  const [emoji] = useState([
    require("../assets/emoji1.jpeg"),
    require("../assets/emoji2.jpeg"),
    require("../assets/emoji3.jpeg"),
    require("../assets/emoji4.jpeg"),
    require("../assets/emoji5.jpeg"),
    require("../assets/emoji6.jpeg"),
  ])

  console.log(
    "img",
    require("../assets/emoji1.jpeg"),
    typeof require("../assets/emoji1.jpeg")
  )

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === "web" ? true : false}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() => {
              onSelect(item)
              onClose()
            }}
          >
            <Image source={item} key={index} style={styles.image} />
          </Pressable>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
})