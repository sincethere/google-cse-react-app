/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const HOST = 'http://127.0.0.1:40001';

class GoogleCseReactApp extends Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.data = null;

    this.input = {
      query: ''
    }

    this.state = {
      dataSource: this.ds.cloneWithRows(this.data ? this.data.items : []),
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }

  _renderHeader() {
    return (
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          maxLength={30}
          onChangeText={
            (text) => {
              this.input.query = text;
            }
          }
          placeholder={'Search'}
          placeholderTextColor={'#F5FCFF'}
        />
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => {
            if (this.input.query.length > 0) {
              this._doSearch(this.input.query, 1);
            } else {
              alert('please enter something you want to search');
            }
          }}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderRow(rowData: any, sectionID: number, rowID: number) {
    return (
      <View key={rowID} style={styles.item}>
        <TouchableOpacity
          onPress={() => {

          }}
        >
          <Text>{rowData.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderFooter() {
    if (!this.data) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (this.data.queries.request[0].startIndex < 90) {
            this._doSearch(
              this.data.queries.request[0].searchTerms,
              (this.data.queries.request[0].startIndex + 19) / 10
            );
          } else {
            return null;
          }
        }}
      >
        <Text>Next Page</Text>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionID: number, rowID: number) {
    return <View key={rowID} style={styles.separator} />
  }

  _doSearch(query, page) {
    console.log(`query=${query}&page=${page}`);
    fetch(`${HOST}/search?query=${query}&page=${page}`)
      .then((res) => {
        if (res.status != 200) {
          alert(`Network error! err_code = ${res.status}`);
        } else {
          res.json().then((data) => {
            this.data = data;
            this.setState({
              dataSource: this.ds.cloneWithRows(this.data.items),
            });
          });
        }
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 20, // ios header
  },
  list: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: 30,
  },
  input: {
    width: Dimensions.get('window').width - 50,
    borderWidth: 1,
    borderColor: '#000000',
  },
  btnSubmit: {
    width: 50,
  },
  separator: {
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    borderTopColor: '#000000',
  }
});

AppRegistry.registerComponent('GoogleCseReactApp', () => GoogleCseReactApp);
