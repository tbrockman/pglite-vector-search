import { pipeline, PipelineType, env } from '@huggingface/transformers';

const isBrowser = (typeof window !== 'undefined')
env.allowLocalModels = isBrowser;

export class Pipeline {
  static task: PipelineType = 'feature-extraction';
  static model: string = 'gte-small';
  static org: string = 'Supabase'
  static repo: string = `${this.org}/${this.model}`
  static extractor: any = null;

  static async get() {
    if (!this.extractor) {
      const modelPaths = {
        modelPath: `/${this.model}`,
        onnxModelFiles: {
          model: `/${this.model}/onnx/model.onnx`,
        },
        tokenizerPath: `/${this.model}`,
        configPath: `/${this.model}/config.json`,
        tokenizerConfigPath: `/${this.model}/tokenizer_config.json`,
        vocabPath: `/${this.model}/vocab.txt`,
        tokenizerJsonPath: `/${this.model}/tokenizer.json`,
      };

      // resolve from local in the browser
      // for some reason this caused me issues during build (even after resolving paths properly)
      // so if not running in browser it uses its default remote fetch 🤷
      this.extractor = isBrowser ?
        await pipeline(this.task, this.model, {
          local_files_only: true,
          // @ts-expect-error
          device: !!navigator.gpu ? 'webgpu' : 'wasm',
          ...modelPaths,
        }) :
        await pipeline(this.task, this.repo)
    }
    return this.extractor;
  }

  static async classify(text: string): Promise<number[]> {
    const extractor = await Pipeline.get();
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data);
  }
}