import React, {forwardRef, useEffect, useImperativeHandle} from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { RichEditorHtml } from './RichTextEditorHTML'
import * as Font from "expo-font";

interface RichTextEditorProps {
	containerStyle?: ViewStyle
	toolbar?: boolean
	editorContainerStyle?: ViewStyle
	showsHorizontalScrollIndicator?: boolean
	showsVerticalScrollIndicator?: boolean
	onContentChange?: (event: any) => void
}

export interface RichTextEditorRef {
	passToEditor: (
		event:
			| string
			| 'bold'
			| 'underline'
			| 'italic'
			| 'justifyLeft'
			| 'justifyCenter'
			| 'justifyFull'
			| 'justifyRight'
			| 'insertUnorderedList'
			| 'insertOrderedList',
		customJS?: boolean
	) => void
	onLoad?: (text: string) => void
}

const defaultProps = {
	toolbar: true,
	showsHorizontalScrollIndicator: false,
	showsVerticalScrollIndicator: false,
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>((props, ref) => {
	var WebViewRef: any
	const onMessage = (event: any) => {
		if (props.onContentChange) props.onContentChange(event.nativeEvent)
	}
	const passToEditor = (event: string, customJS?: boolean) => {
		const command = customJS ? event : `document.execCommand('${event}'); true;`
		WebViewRef.injectJavaScript(command)
	}

	useEffect(() => {
		WebViewRef.injectJavaScript(`document.querySelector("#textEditor").innerHTML = '${props.texto}';true;`)
	}, [props.texto]);

	useImperativeHandle(ref, () => ({ passToEditor: passToEditor }))
	return (
		<View style={props.containerStyle ? props.containerStyle : Styles.container}>
			<WebView
				ref={(ref) => (WebViewRef = ref)}
				style={{
					flex: 1,
					overflow: 'hidden',
				}}
				originWhitelist={['*']}
				source={{ html: RichEditorHtml }}
				onMessage={(event) => {
					onMessage(event)
				}}
				showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
				showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
			/>
		</View>
	)
})

RichTextEditor.defaultProps = defaultProps

const Styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		borderWidth: 1,
		marginBottom: 1,
		overflow: 'hidden',
		borderColor: "#ADB5BD",
		borderTopWidth: 0,
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		// marginBottom: 3
	},
})
