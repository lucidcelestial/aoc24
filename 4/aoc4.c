#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define BUF_SIZE 512

const char searchPart1[] = "XMAS";

int getFileLineCount(FILE *fptr) {
    int lineCount = 0;
    char linebuffer[BUF_SIZE];

    while(fgets(linebuffer, BUF_SIZE, fptr) != NULL) {
        lineCount += 1;
    }

    return lineCount;
}

// allocating every line separately because i cbf to deal with string arrays
void readFileIntoBuffer(FILE *fptr, char*** buffer, int lineCount) {
    for(int i = 0; i < lineCount; i++) {
        (*buffer)[i] = (char*)malloc(sizeof(char) * BUF_SIZE);
        fscanf(fptr, "%s", (*buffer)[i]);
    }
}

int hasXMAS(char **buffer, int lineCount, int x, int y) {
    int count = 0;
    bool check = true;
    int lastIndex = strlen(buffer[0]) - 1;

    int modeMultipliers[8][2] = {
        {0, -1},    // up
        {1, -1},    // up right
        {1, 0},     // right
        {1, 1},     // down right
        {0, 1},     // down
        {-1, 1},    // down left
        {-1, 0},    // left
        {-1, -1}    // up left
    };

    for(int mode = 0; mode < 8; mode++) {
        for(int i = 1; i < 4; i++) {
            if(
                x + (i * modeMultipliers[mode][0]) < 0 ||
                x + (i * modeMultipliers[mode][0]) > lastIndex ||
                y + (i * modeMultipliers[mode][1]) < 0 ||
                y + (i * modeMultipliers[mode][1]) >= lineCount ||
                buffer[y + (i * modeMultipliers[mode][1])][x + (i * modeMultipliers[mode][0])] != searchPart1[i]
            ) {
                check = false;
                break;
            }
        }
        count += check ? 1 : 0;
        check = true;
    }

    return count;
}

int part1(char **buffer, int lineCount) {
    int count = 0;
    int len = strlen(buffer[0]);

    for(int y = 0; y < lineCount; y++) {
        for(int x = 0; x < len; x++) {
            count += buffer[y][x] == searchPart1[0] ? hasXMAS(buffer, lineCount, x, y) : 0;
        }
    }

    return count;
}

int main(void) {
    FILE *fptr = fopen("input.txt", "r");

    int lineCount = getFileLineCount(fptr);
    char **buffer = malloc(sizeof(char*) * lineCount);

    rewind(fptr);
    readFileIntoBuffer(fptr, &buffer, lineCount);
    fclose(fptr);

    printf("Part 1: %i", part1(buffer, lineCount));

    return 0;
}
