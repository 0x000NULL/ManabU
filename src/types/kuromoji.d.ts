declare module 'kuromoji' {
  interface IpadicFeatures {
    word_id: number
    word_type: string
    word_position: number
    surface_form: string
    pos: string
    pos_detail_1: string
    pos_detail_2: string
    pos_detail_3: string
    conjugated_type: string
    conjugated_form: string
    basic_form: string
    reading?: string
    pronunciation?: string
  }

  interface Tokenizer {
    tokenize(text: string): IpadicFeatures[]
  }

  interface TokenizerBuilder {
    build(callback: (err: Error | null, tokenizer: Tokenizer) => void): void
  }

  function builder(options: { dicPath: string }): TokenizerBuilder

  export { IpadicFeatures, Tokenizer, TokenizerBuilder, builder }
}
