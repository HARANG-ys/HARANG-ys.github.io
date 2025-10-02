#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  if (argc != 4) {
    (void)printf("Usage: %s <num> <op> <num>\n", argv[0]);
    return EXIT_FAILURE;
  }

  double lhs = strtod(argv[1], NULL);
  char   op = argv[2][0];
  double rhs = strtod(argv[3], NULL);

  double result;
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
    if (rhs == 0) {
      (void)printf("Error: division by zero\n");
      return 0;
    }
    result = lhs / rhs;
    break;
    
  default:
    (void)printf("Unknown operator: %c\n", op);
    return EXIT_FAILURE;
  }

  (void)printf("%d %c %d = %d\n", lhs, op, rhs, result);
  return EXIT_SUCCESS;
}
