public class Routines {

//    public static Routine sequence(Routine... routines){
//    	Sequence sequence = new Sequence();
//    	for(Routine r:routines){
//    		sequence.addRoutine(r);
//    	}
//    	return sequence;
//    }
//    
//    public static Routine selector(Routine... routines){
//    	Selector selector = new Selector();
//    	for(Routine r:routines){
//    		selector.addRoutine(r);
//    	}
//    	return selector;	
//    }
    
    public static Routine seek(Apple apple, Bot bot, Player player){
    	return new Seek(apple, bot, player);
    }
    
    public static Routine move(Bot bot){
    	return new Move(bot);
    }
    
    public static Routine turn(Apple apple, Bot bot, Player player){
    	return new Turn(apple, bot, player);
    }
        
//    public static Routine repeat(Routine routine, int times){
//    	return new Repeat(routine, times);
//    }
//    
//    public static Routine repeatInfinite(Routine routine){
//    	return new Repeat(routine);
//    }   
}