use std::fs;

fn get_nth_bit(num: u64, n: usize) -> bool {
    num & (1 << n) != 0
}

fn main() {
    let file = fs::read_to_string("input.txt").expect("file not found");

    let equations = file
        .lines()
        .map(|line| -> (u64, Vec<u64>) {
            let sides = line.split(':').collect::<Vec<&str>>();

            (
                sides[0].parse::<u64>().expect("failed to parse"),
                sides[1]
                    .trim()
                    .split(' ')
                    .map(|num| -> u64 { num.parse::<u64>().expect("failed to parse") })
                    .collect::<Vec<u64>>(),
            )
        })
        .collect::<Vec<(u64, Vec<u64>)>>();

    let filtered = equations.iter().filter_map(|(key, value)| {
        let n = u64::pow(2, value.len() as u32 - 1);

        for i in 0..n {
            let mut reduct_i = 0;

            let eval = value.clone().iter().fold(0, |result, current| {
                if result == 0 {
                    return result + current;
                }

                if get_nth_bit(i, reduct_i) {
                    reduct_i += 1;
                    return result * current;
                } else {
                    reduct_i += 1;
                    return result + current;
                }
            });

            if eval == *key {
                return Some(key.to_owned());
            }
        }

        None
    });

    println!("{:?}", filtered.into_iter().sum::<u64>());
}
