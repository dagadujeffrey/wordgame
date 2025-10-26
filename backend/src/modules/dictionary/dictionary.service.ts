import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class DictionaryService {
  private readonly logger = new Logger(DictionaryService.name);
  private dictionary: Set<string> | null = null;
  private loadingPromise: Promise<Set<string>> | null = null;

  async isValidWord(candidate: string): Promise<boolean> {
    const normalized = candidate.trim().toLowerCase();
    if (normalized.length < 2 || normalized.length > 4) {
      return false;
    }

    const dictionary = await this.getDictionary();
    return dictionary.has(normalized);
  }

  async getDictionary(): Promise<Set<string>> {
    if (this.dictionary) {
      return this.dictionary;
    }

    if (!this.loadingPromise) {
      this.loadingPromise = this.loadDictionary();
    }

    this.dictionary = await this.loadingPromise;
    return this.dictionary;
  }

  private async loadDictionary(): Promise<Set<string>> {
    const dictionaryPath = process.env.DICTIONARY_PATH ?? path.join(__dirname, '../../assets/dictionary/words_alpha.txt');

    try {
      const file = await fs.readFile(dictionaryPath, 'utf8');
      const entries = file
        .split(/\r?\n/) // support Windows and Unix newlines
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length >= 2 && word.length <= 4);

      this.logger.log(`Loaded ${entries.length} dictionary entries from ${dictionaryPath}`);
      return new Set(entries);
    } catch (error) {
      this.logger.error(`Failed to load dictionary from ${dictionaryPath}: ${error instanceof Error ? error.message : error}`);

      // Provide a minimal fallback set so the application can still operate in development.
      return new Set(['word', 'grid', 'game', 'play', 'tile', 'line', 'rows', 'cols', 'ally', 'open']);
    }
  }
}
