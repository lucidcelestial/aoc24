use std::fs;

fn find_guard_pos(lines: &Vec<Vec<char>>) -> Option<(i32, i32)> {
    for y in 0..lines.len() {
        for x in 0..lines[y].len() {
            if lines[y][x] == '^' {
                return Some((x as i32,y as i32));
            }
        }
    }
    None
}

fn valid_block(lines: Vec<Vec<char>>, mut pos: (i32, i32), mut move_vec: (i32, i32)) -> bool {
    let mut turns = 0;
    let original_pos = pos.clone();

    pos.0 += move_vec.0;
    pos.1 += move_vec.1;

    while pos.0 + move_vec.0 != -1 && pos.1 + move_vec.1 != -1 && pos.0 + move_vec.0 != lines.len() as i32 && pos.1 + move_vec.1 != lines[0].len() as i32 && turns <= 4 {
        let c = lines[(pos.1 + move_vec.1) as usize][(pos.0 + move_vec.0) as usize];

        if c == '#' {
            move_vec = (-1 * move_vec.1, move_vec.0);
            turns += 1;
            continue;
        }

        pos.0 += move_vec.0;
        pos.1 += move_vec.1;

        if original_pos == pos {
            println!("{:?}", pos);
            return true;
        }
    }
    return false;
}

fn walk_guard(mut lines: Vec<Vec<char>>, mut pos: (i32, i32)) -> Option<(u32, u32)> {
    let mut visited: u32 = 1;
    let mut possible_blocks: u32 = 0;
    let mut move_vec: (i32, i32) = (0, -1);

    while pos.0 + move_vec.0 != -1 && pos.1 + move_vec.1 != -1 && pos.0 + move_vec.0 != lines.len() as i32 && pos.1 + move_vec.1 != lines[0].len() as i32 {
        let c = lines[(pos.1 + move_vec.1) as usize][(pos.0 + move_vec.0) as usize];

        if c == '#' {
            move_vec = (-1 * move_vec.1, move_vec.0);
            continue;
        }

        pos.0 += move_vec.0;
        pos.1 += move_vec.1;
    
        possible_blocks += if valid_block(lines.to_owned(), pos.to_owned(), (-1 * move_vec.1, move_vec.0)) { 1 } else { 0 };

        if c != 'X' {
            visited += 1;
        }

        lines[pos.1 as usize][pos.0 as usize] = 'X';
    }

    fs::write("walk.txt", lines.into_iter().map(|line: Vec<char>| -> String { line.into_iter().collect() }).collect::<Vec<String>>().join("\n")).expect("could not create file");

    Some((visited, possible_blocks))
}

fn main() {
    let file = fs::read_to_string("input.txt").expect("file not found");
    let lines = file.lines().map(|line: &str| -> Vec<char> {
        line.chars().collect()
    }).collect::<Vec<Vec<char>>>();

    let pos = find_guard_pos(&lines).expect("couldn't find guard");

    let counts = walk_guard(lines.to_owned(), pos).expect("error occured during walk");

    println!("{:?}", counts.0);
    println!("{:?}", counts.1);

}
