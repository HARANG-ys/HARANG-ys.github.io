#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  if (argc != 4) {
    (void)printf("Usage: %s <num> <op> <num>\n", argv[0]);
    return EXIT_FAILURE;
  }

  // FIXME: allow floating point numbers!
  int lhs = atoi(argv[1]);
  char op = argv[2][0];
  int rhs = atoi(argv[3]);

  int result;
  switch (op) {
  case '+':
    result = lhs + rhs;
    break;
  case '-':
    result = lhs - rhs;
    break;
  case '*':
    result = lhs * rhs;
    break;
  case '/':
    // FIXME: handle division by zero here!
    result = lhs / rhs;
    break;
    
  default:
    (void)printf("Unknown operator: %c\n", op);
    return EXIT_FAILURE;
  }

  (void)printf("%d %c %d = %d\n", lhs, op, rhs, result);
  return EXIT_SUCCESS;
}
