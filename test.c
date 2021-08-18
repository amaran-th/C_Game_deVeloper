#include <stdio.h>
int main(){ 

   {int bread = 1;} 

   for(int i=0; i<100; i++){
      {bread} = {bread} + 1 ; 
   }

   printf("%d", {bread} );
}