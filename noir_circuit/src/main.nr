fn main(x: Field) {
    assert(x  * x == 25);
}

#[test]
fn test_main() {
    main(5);

    // Uncomment to make test fail
    // main(1);
}
