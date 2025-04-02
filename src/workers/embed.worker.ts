/**
 * Classify embeddings in the browser in a SharedWorker, rather than burden the UI thread
 */
import * as comlink from 'comlink';
import { Pipeline } from '../utils/extractor';


export const classify = async (text: string) => {
    return await Pipeline.classify(text)
}

onconnect = async function (event) {
    const [port] = event.ports;
    comlink.expose({ classify }, port);
}
